package com.bank.bi.service.agent;

import com.bank.bi.model.enums.SkillType;
import com.bank.bi.model.entity.Message;
import com.bank.bi.model.entity.Conversation;
import com.bank.bi.service.HiAgentService;
import com.bank.bi.service.KnowledgeService;
import com.bank.bi.repository.ConversationRepository;
import com.bank.bi.repository.MessageRepository;
import com.bank.bi.util.SafeQueryBuilder;
import com.bank.bi.model.dto.HiAgentRequest;
import com.bank.bi.model.dto.HiAgentResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.bank.bi.config.HiAgentConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Agent 工作流编排服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AgentWorkflowService {

    private final IntentRouter intentRouter;
    private final HiAgentService hiAgentService;
    private final KnowledgeService knowledgeService;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final SafeQueryBuilder safeQueryBuilder;
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;
    private final HiAgentConfig hiAgentConfig;
    private final com.bank.bi.skill.SkillRegistry skillRegistry;

    /**
     * 执行智能对话工作流
     * @param query 用户问题
     * @param userId 用户ID
     * @param conversationId 对话ID (可选)
     * @return 响应结果
     */
    public Map<String, Object> execute(String query, Long userId, Long conversationId) {
        // 1. 意图识别 (Router)
        SkillType skillType = intentRouter.route(query);
        
        Map<String, Object> result = new HashMap<>();
        result.put("intent", skillType.getCode());
        result.put("intentName", skillType.getName());

        // 2. 根据意图分发 (Dispatcher)
        switch (skillType) {
            case DATA_QUERY:
                // 结构化查询生成 + 安全SQL构建 + 执行 + 入库
                Conversation dqConversation;
                if (conversationId != null) {
                    dqConversation = conversationRepository.findById(conversationId)
                            .orElseThrow(() -> new RuntimeException("对话不存在"));
                } else {
                    String title = query.length() > 50 ? query.substring(0, 50) + "..." : query;
                    dqConversation = Conversation.builder()
                            .userId(userId)
                            .sessionId(UUID.randomUUID().toString())
                            .module("data")
                            .title(title)
                            .status(1)
                            .messageCount(0)
                            .startedTime(LocalDateTime.now())
                            .build();
                    dqConversation = conversationRepository.save(dqConversation);
                }

                Message dqUserMsg = Message.builder()
                        .conversationId(dqConversation.getConversationId())
                        .type("user")
                        .content(query)
                        .createdTime(LocalDateTime.now())
                        .build();
                messageRepository.save(dqUserMsg);

                SafeQueryBuilder.QueryRequest qr = generateQuerySpec(query);
                String sql = safeQueryBuilder.buildSql(qr, "ALL");
                java.util.List<java.util.Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
                int rowCount = rows.size();
                String preview;
                try {
                    preview = objectMapper.writeValueAsString(rows.stream().limit(5).toList());
                } catch (Exception e) {
                    preview = "[preview serialization error]";
                }

                String dqAnswer = "已执行数据查询，返回 " + rowCount + " 行。预览：" + preview;

                Message dqAiMsg = Message.builder()
                        .conversationId(dqConversation.getConversationId())
                        .type("assistant")
                        .content(dqAnswer)
                        .queryText(query)
                        .intent(SkillType.DATA_QUERY.getCode())
                        .responseTime(0)
                        .createdTime(LocalDateTime.now())
                        .build();
                dqAiMsg = messageRepository.save(dqAiMsg);

                dqConversation.setMessageCount(dqConversation.getMessageCount() + 2);
                conversationRepository.save(dqConversation);

                result.put("type", "data");
                result.put("message", dqAnswer);
                result.put("conversationId", java.util.Objects.requireNonNull(dqConversation.getConversationId()));
                result.put("messageId", java.util.Objects.requireNonNull(dqAiMsg.getMessageId()));
                result.put("sql", sql);
                result.put("rowCount", rowCount);
                break;
                
            case KNOWLEDGE_BASE:
                // RAG 分支：检索 + 生成，并写入对话与消息记录
                Conversation conversation;
                if (conversationId != null) {
                    conversation = conversationRepository.findById(conversationId)
                            .orElseThrow(() -> new RuntimeException("对话不存在"));
                } else {
                    String title = query.length() > 50 ? query.substring(0, 50) + "..." : query;
                    conversation = Conversation.builder()
                            .userId(userId)
                            .sessionId(UUID.randomUUID().toString())
                            .module("knowledge")
                            .title(title)
                            .status(1)
                            .messageCount(0)
                            .startedTime(LocalDateTime.now())
                            .build();
                    conversation = conversationRepository.save(conversation);
                }

                Message userMessage = Message.builder()
                        .conversationId(conversation.getConversationId())
                        .type("user")
                        .content(query)
                        .createdTime(LocalDateTime.now())
                        .build();
                messageRepository.save(userMessage);

                Map<String, Object> ragResult = knowledgeService.ask(query, userId);
                String answer = (String) ragResult.getOrDefault("answer", "抱歉，知识库中暂时没有相关信息");

                Message aiMsg = Message.builder()
                        .conversationId(conversation.getConversationId())
                        .type("assistant")
                        .content(answer)
                        .queryText(query)
                        .intent(SkillType.KNOWLEDGE_BASE.getCode())
                        .responseTime(0)
                        .createdTime(LocalDateTime.now())
                        .build();
                aiMsg = messageRepository.save(aiMsg);

                conversation.setMessageCount(conversation.getMessageCount() + 2);
                conversationRepository.save(conversation);

                result.put("type", "knowledge");
                result.put("message", answer);
                result.put("sources", ragResult.get("sources"));
                result.put("conversationId", java.util.Objects.requireNonNull(conversation.getConversationId()));
                result.put("messageId", java.util.Objects.requireNonNull(aiMsg.getMessageId()));
                break;
                
            case CHART_GENERATION:
                // TODO: 接入图表生成模块
                result.put("type", "chart");
                result.put("message", "识别为图表生成意图，正在开发图表模块... (Mock: 已生成饼图)");
                break;
                
            case CHIT_CHAT:
            default:
                // 闲聊分支：调用多轮对话以保持会话上下文与消息记录
                Message aiMessage = hiAgentService.multiRoundChat(
                        query,
                        null,           // module 可选，使用默认模块
                        conversationId,
                        userId
                );
                result.put("type", "text");
                result.put("message", java.util.Objects.requireNonNull(aiMessage.getContent()));
                result.put("conversationId", java.util.Objects.requireNonNull(aiMessage.getConversationId()));
                result.put("messageId", java.util.Objects.requireNonNull(aiMessage.getMessageId()));
                break;
        }
        
        return result;
    }

    private SafeQueryBuilder.QueryRequest generateQuerySpec(String userQuery) {
        String systemPrompt;
        
        // Try to load prompt from skill definition
        var skillOpt = skillRegistry.get("data_query");
        if (skillOpt.isPresent() && skillOpt.get().getInstruction() != null) {
            systemPrompt = skillOpt.get().getInstruction();
            
            // Inject schema if available
            if (skillOpt.get().getSchema() != null) {
                try {
                    String schemaJson = objectMapper.writeValueAsString(skillOpt.get().getSchema());
                    systemPrompt += "\n\n## Dynamic Schema (Whitelist)\n" + schemaJson;
                } catch (Exception e) {
                    log.warn("Failed to inject schema into prompt", e);
                }
            }
        } else {
             // Fallback
             systemPrompt = """
                你是银行数据查询助手。请将用户查询需求转换为一个JSON对象，字段如下：
                {
                  "table": "表名（例如 deposit, loan, transaction）",
                  "columns": ["列1", "列2", "可使用聚合函数如 SUM(amount) as total"],
                  "filters": [{"column":"列名","operator":"=|!=|>|<|>=|<=|LIKE|IN","value":"值"}],
                  "groupBy": ["列名"],
                  "orderBy": ["列名 ASC|DESC"],
                  "limit": 50
                }
                只返回合法JSON，勿包含其他文字。
                如用户未给出明确列与条件，请合理补全默认列与限制条件。
                """;
        }

        java.util.List<HiAgentRequest.Message> messages = new java.util.ArrayList<>();
        messages.add(HiAgentRequest.Message.builder().role("system").content(systemPrompt).build());
        messages.add(HiAgentRequest.Message.builder().role("user").content(userQuery).build());

        HiAgentRequest req = HiAgentRequest.builder()
                .model(hiAgentConfig.getModel())
                .messages(messages)
                .temperature(0.1)
                .maxTokens(1000) // Increased for better instruction following
                .stream(false)
                .build();

        try {
            HiAgentResponse resp = hiAgentService.chat(req);
            String content = resp.getChoices().get(0).getMessage().getContent();
            // Clean markdown blocks if present
            if (content.startsWith("```")) {
                content = content.replaceAll("```json", "").replaceAll("```", "").trim();
            }
            return objectMapper.readValue(content, SafeQueryBuilder.QueryRequest.class);
        } catch (Exception e) {
            log.error("Query generation failed", e);
            // 回退为一个安全的默认查询
            SafeQueryBuilder.QueryRequest fallback = new SafeQueryBuilder.QueryRequest();
            fallback.setTable("deposit");
            fallback.setColumns(java.util.List.of("*"));
            fallback.setLimit(50);
            return fallback;
        }
    }
}
