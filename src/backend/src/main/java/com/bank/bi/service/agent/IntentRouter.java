package com.bank.bi.service.agent;

import com.bank.bi.config.HiAgentConfig;
import com.bank.bi.model.dto.HiAgentRequest;
import com.bank.bi.model.dto.HiAgentResponse;
import com.bank.bi.model.enums.SkillType;
import com.bank.bi.service.HiAgentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 意图识别路由器
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class IntentRouter {

    private final HiAgentService hiAgentService;
    private final HiAgentConfig hiAgentConfig;
    private final com.bank.bi.skill.SkillRegistry skillRegistry; // Use dynamic registry

    /**
     * 路由用户的查询意图
     */
    public SkillType route(String userQuery) {
        log.info("正在识别用户意图: {}", userQuery);

        // 1. 构建 Prompt
        String systemPrompt = buildRouterPrompt();

        // 2. 构建请求
        List<HiAgentRequest.Message> messages = new ArrayList<>();
        messages.add(HiAgentRequest.Message.builder().role("system").content(systemPrompt).build());
        messages.add(HiAgentRequest.Message.builder().role("user").content(userQuery).build());

        HiAgentRequest request = HiAgentRequest.builder()
                .model(hiAgentConfig.getModel())
                .messages(messages)
                .temperature(0.1) // 低温度以保证确定性
                .maxTokens(50)
                .stream(false)
                .build();

        // 3. 调用 AI
        try {
            HiAgentResponse response = hiAgentService.chat(request);
            if (response != null && !response.getChoices().isEmpty()) {
                String content = response.getChoices().get(0).getMessage().getContent().trim();
                return parseIntent(content);
            }
        } catch (Exception e) {
            log.error("意图识别失败，回退到默认闲聊模式", e);
        }

        return SkillType.CHIT_CHAT; // 默认回退
    }

    private String buildRouterPrompt() {
        StringBuilder sb = new StringBuilder();
        sb.append("你是一个智能意图识别助手。请分析用户的输入，并将其分类为以下类别之一：\n\n");
        
        // Use dynamic skills from registry
        for (com.bank.bi.skill.SkillDefinition skill : skillRegistry.list()) {
             sb.append("- ").append(skill.getCode()).append(": ").append(skill.getDescription()).append("\n");
             if (skill.getTriggerKeywords() != null && !skill.getTriggerKeywords().isEmpty()) {
                 sb.append("  (触发词: ").append(String.join(", ", skill.getTriggerKeywords())).append(")\n");
             }
        }
        
        // Add default fallback (ChitChat is handled as default if no match, but let's list it implicitly or explicitly)
        sb.append("- chit_chat: 普通闲聊或无法归类到上述意图的查询\n");

        sb.append("\n只返回类别代码（例如 'data_query'），不要返回任何其他解释或文字。");
        return sb.toString();
    }

    private SkillType parseIntent(String content) {
        // 清理可能的 Markdown 格式，如 ```json ... ``` 或 `code`
        String cleaned = content.replace("`", "").trim();
        
        // First check dynamic skills
        if (skillRegistry.get(cleaned).isPresent()) {
             // Map dynamic skill code back to enum if possible, or we need to change how AgentWorkflowService works
             // For now, let's map known ones to enum and others to a generic handle?
             // But the original code returns SkillType enum.
             // We need to support the existing enum values for now: DATA_QUERY, KNOWLEDGE_BASE, CHART_GENERATION, CHIT_CHAT
             
             try {
                 return SkillType.valueOf(cleaned.toUpperCase());
             } catch (IllegalArgumentException e) {
                 // If dynamic skill is not in enum, what to do?
                 // Currently AgentWorkflowService switches on Enum. 
                 // So we must ensure dynamic skills map to these Enums or refactor AgentWorkflowService too.
                 // For this task, let's assume we are migrating existing skills to dynamic loading but keeping the Enum for dispatch logic for now.
                 // Or we map based on code equality ignoring case.
             }
        }
        
        for (SkillType type : SkillType.values()) {
            if (cleaned.equalsIgnoreCase(type.getCode())) {
                log.info("意图识别结果: {} ({})", type.getName(), type.getCode());
                return type;
            }
        }
        
        log.warn("无法解析意图: {}, 归类为闲聊", content);
        return SkillType.CHIT_CHAT;
    }
}
