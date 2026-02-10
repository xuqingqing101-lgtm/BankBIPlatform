package com.bank.bi.service;

import com.bank.bi.config.HiAgentConfig;
import com.bank.bi.model.dto.HiAgentRequest;
import com.bank.bi.model.dto.HiAgentResponse;
import com.bank.bi.model.entity.Conversation;
import com.bank.bi.model.entity.Message;
import com.bank.bi.repository.ConversationRepository;
import com.bank.bi.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * HiAgent AI服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HiAgentService {
    
    private final WebClient hiAgentWebClient;
    private final HiAgentConfig hiAgentConfig;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    
    /**
     * 调用HiAgent API
     */
    public HiAgentResponse chat(HiAgentRequest request) {
        try {
            log.info("调用HiAgent API, model: {}, messages: {}", 
                    request.getModel(), request.getMessages().size());
            
            HiAgentResponse response = hiAgentWebClient
                    .post()
                    .uri("/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(HiAgentResponse.class)
                    .timeout(Duration.ofMillis(hiAgentConfig.getTimeout()))
                    .block();
            
            if (response != null && response.getUsage() != null) {
                log.info("HiAgent响应成功, tokens: {}", response.getUsage().getTotalTokens());
            }
            
            return response;
            
        } catch (Exception e) {
            log.error("调用HiAgent API失败", e);
            throw new RuntimeException("AI服务调用失败: " + e.getMessage());
        }
    }
    
    /**
     * 多轮对话
     */
    @Transactional
    public Message multiRoundChat(String query, String module, Long conversationId, Long userId) {
        long startTime = System.currentTimeMillis();
        
        // 1. 获取或创建对话
        Conversation conversation;
        if (conversationId != null) {
            conversation = conversationRepository.findById(conversationId)
                    .orElseThrow(() -> new RuntimeException("对话不存在"));
        } else {
            conversation = createConversation(userId, module, query);
        }
        
        // 2. 保存用户消息
        Message userMessage = Message.builder()
                .conversationId(conversation.getConversationId())
                .type("user")
                .content(query)
                .createdTime(LocalDateTime.now())
                .build();
        messageRepository.save(userMessage);
        
        // 3. 获取对话历史
        List<Message> history = messageRepository
                .findByConversationIdOrderByCreatedTimeAsc(conversation.getConversationId());
        
        // 4. 构建HiAgent请求
        List<HiAgentRequest.Message> messages = new ArrayList<>();
        
        // 系统提示词
        String systemPrompt = buildSystemPrompt(conversation.getModule());
        messages.add(HiAgentRequest.Message.builder()
                .role("system")
                .content(systemPrompt)
                .build());
        
        // 历史对话（最近10轮）
        int historySize = history.size();
        int startIndex = Math.max(0, historySize - 20);  // 最多取最近20条消息（10轮对话）
        messages.addAll(history.subList(startIndex, historySize).stream()
                .map(msg -> HiAgentRequest.Message.builder()
                        .role(msg.getType())
                        .content(msg.getContent())
                        .build())
                .collect(Collectors.toList()));
        
        HiAgentRequest request = HiAgentRequest.builder()
                .model(hiAgentConfig.getModel())
                .messages(messages)
                .temperature(hiAgentConfig.getTemperature())
                .maxTokens(hiAgentConfig.getMaxTokens())
                .stream(false)
                .build();
        
        // 5. 调用HiAgent
        HiAgentResponse response = chat(request);
        String aiResponse = response.getChoices().get(0).getMessage().getContent();
        
        // 6. 保存AI回复
        long responseTime = System.currentTimeMillis() - startTime;
        Message aiMessage = Message.builder()
                .conversationId(conversation.getConversationId())
                .type("assistant")
                .content(aiResponse)
                .queryText(query)
                .modelName(hiAgentConfig.getModel())
                .tokensUsed(response.getUsage().getTotalTokens())
                .responseTime((int) responseTime)
                .createdTime(LocalDateTime.now())
                .build();
        messageRepository.save(aiMessage);
        
        // 7. 更新对话统计
        conversation.setMessageCount(conversation.getMessageCount() + 2);
        conversationRepository.save(conversation);
        
        return aiMessage;
    }
    
    /**
     * 创建新对话
     */
    private Conversation createConversation(Long userId, String module, String firstQuery) {
        String title = firstQuery.length() > 50 
                ? firstQuery.substring(0, 50) + "..." 
                : firstQuery;
        
        Conversation conversation = Conversation.builder()
                .userId(userId)
                .sessionId(UUID.randomUUID().toString())
                .module(module != null ? module : "deposit")
                .title(title)
                .status(1)
                .messageCount(0)
                .startedTime(LocalDateTime.now())
                .build();
        
        return conversationRepository.save(conversation);
    }
    
    /**
     * 构建系统提示词
     */
    private String buildSystemPrompt(String module) {
        String basePrompt = """
            你是一位专业的银行业务AI分析助手，具备以下能力：
            1. 深入理解银行"存贷汇"三大核心业务
            2. 熟悉对公和零售两大客户体系
            3. 能够分析财务数据、业务指标和风险状况
            4. 提供专业、准确、简洁的数据分析和建议
            
            回答要求：
            - 基于数据和业务逻辑分析
            - 使用专业术语，但保持易懂
            - 重点突出，结构清晰
            - 必要时提供数据支撑和图表建议
            - 主动识别风险和机会
            """;
        
        return switch (module) {
            case "deposit" -> basePrompt + "\n\n当前聚焦：存款业务分析（余额、增长、结构、客户）";
            case "loan" -> basePrompt + "\n\n当前聚焦：贷款业务分析（余额、不良率、行业分布、风险）";
            case "intermediate" -> basePrompt + "\n\n当前聚焦：中间业务分析（收入、占比、趋势、产品）";
            case "customer" -> basePrompt + "\n\n当前聚焦：客户画像分析（分层、价值、活跃度、AUM）";
            case "dashboard" -> basePrompt + "\n\n当前聚焦：经营管理驾驶舱（KPI、趋势、预警、决策支持）";
            case "knowledge" -> basePrompt + "\n\n当前聚焦：制度流程查询（准确引用、流程说明、合规指导）";
            default -> basePrompt;
        };
    }
    
    /**
     * 获取对话历史
     */
    public List<Message> getConversationHistory(Long conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedTimeAsc(conversationId);
    }
    
    /**
     * 获取用户的所有对话
     */
    public List<Conversation> getUserConversations(Long userId) {
        return conversationRepository.findByUserIdOrderByStartedTimeDesc(userId);
    }

    /**
     * 智能数据分析（模拟 Text-to-SQL）
     */
    public java.util.Map<String, Object> analyzeData(String query) {
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        
        // 1. 模拟 SQL 生成
        String sql;
        java.util.List<java.util.Map<String, Object>> data = new java.util.ArrayList<>();
        
        if (query.contains("存款")) {
            sql = "SELECT product_type, SUM(balance) as total_balance FROM deposit_accounts WHERE date = '2024-03-15' GROUP BY product_type";
            data.add(java.util.Map.of("product_type", "活期存款", "total_balance", 152300000));
            data.add(java.util.Map.of("product_type", "定期存款", "total_balance", 284500000));
            data.add(java.util.Map.of("product_type", "大额存单", "total_balance", 89200000));
        } else if (query.contains("贷款")) {
            sql = "SELECT loan_type, COUNT(*) as count, AVG(interest_rate) as avg_rate FROM loan_contracts WHERE status = 'ACTIVE' GROUP BY loan_type";
            data.add(java.util.Map.of("loan_type", "个人住房贷款", "count", 1250, "avg_rate", 3.85));
            data.add(java.util.Map.of("loan_type", "经营性贷款", "count", 480, "avg_rate", 4.25));
            data.add(java.util.Map.of("loan_type", "消费贷", "count", 3200, "avg_rate", 5.60));
        } else {
            sql = "SELECT * FROM customer_summary LIMIT 5";
            data.add(java.util.Map.of("customer_id", "C001", "name", "某科技公司", "segment", "对公"));
            data.add(java.util.Map.of("customer_id", "C002", "name", "张三", "segment", "零售VIP"));
        }
        
        // 2. 调用 AI 解释数据
        String systemPrompt = """
            你是一个数据分析师。请根据提供的【查询SQL】和【查询结果】，回答用户的【问题】。
            回答要求：
            1. 先直接回答问题的核心结论。
            2. 引用数据支持你的结论。
            3. 如果有必要，指出数据的局限性或建议进一步的分析。
            """;
            
        String userContent = String.format("【问题】%s\n\n【查询SQL】%s\n\n【查询结果】%s", query, sql, data.toString());
        
        List<HiAgentRequest.Message> messages = new ArrayList<>();
        messages.add(HiAgentRequest.Message.builder().role("system").content(systemPrompt).build());
        messages.add(HiAgentRequest.Message.builder().role("user").content(userContent).build());
        
        HiAgentRequest request = HiAgentRequest.builder()
                .model(hiAgentConfig.getModel())
                .messages(messages)
                .temperature(0.5)
                .maxTokens(1000)
                .stream(false)
                .build();
                
        String analysis = "无法生成分析结果";
        try {
            HiAgentResponse response = chat(request);
            if (response != null && !response.getChoices().isEmpty()) {
                analysis = response.getChoices().get(0).getMessage().getContent();
            }
        } catch (Exception e) {
            log.error("AI分析失败", e);
            analysis = "AI服务暂时无法响应，请稍后再试。";
        }
        
        result.put("response", analysis); // 为了兼容前端 ChatInterface
        result.put("sql", sql);
        result.put("data", data);
        result.put("analysis", analysis);
        
        return result;
    }
}
