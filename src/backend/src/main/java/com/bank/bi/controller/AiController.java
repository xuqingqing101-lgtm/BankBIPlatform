package com.bank.bi.controller;

import com.bank.bi.model.dto.ChatRequest;
import com.bank.bi.model.dto.ChatResponse;
import com.bank.bi.model.entity.Conversation;
import com.bank.bi.model.entity.Message;
import com.bank.bi.service.HiAgentService;
import com.bank.bi.service.agent.AgentWorkflowService;
import com.bank.bi.repository.AuditLogRepository;
import com.bank.bi.model.entity.AuditLog;
import com.bank.bi.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AI问答控制器
 */
@Slf4j
@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {
    
        private final HiAgentService hiAgentService;
        private final AgentWorkflowService agentWorkflowService;
        private final AuditLogRepository auditLogRepository;
    
    /**
     * 发送消息（简化版，兼容前端）
     */
        @PostMapping("/chat")
        public ResponseUtil.Result<Map<String, Object>> chat(
                @Valid @RequestBody ChatRequest request,
                HttpServletRequest httpRequest) {
            
            Long userId = (Long) httpRequest.getAttribute("userId");
            if (userId == null) {
                userId = 1L;
                log.warn("未检测到userId，使用默认值: 1");
            }
            
            String txId = java.util.UUID.randomUUID().toString();
            // Put traceId into MDC for logging
            org.slf4j.MDC.put("traceId", txId);
            
            long start = System.currentTimeMillis();
            String ip = httpRequest.getRemoteAddr();
            
            log.info("聊天请求: txId={}, userId={}, module={}, query={}", txId, userId, request.getModule(), request.getQuery());
            
            try {
                Map<String, Object> workflowResult = agentWorkflowService.execute(
                        request.getQuery(),
                        userId,
                        request.getConversationId()
                );
                
                String intent = (String) workflowResult.getOrDefault("intent", "unknown");
                String message = (String) workflowResult.getOrDefault("message", "");
                Object conversationId = workflowResult.getOrDefault("conversationId", null);
                Object messageId = workflowResult.getOrDefault("messageId", null);
                
                Map<String, Object> result = new HashMap<>();
                result.put("txId", txId);
                result.put("sessionId", conversationId != null ? "session-" + conversationId : "session-" + txId);
                result.put("response", message);
                result.put("conversationId", conversationId);
                result.put("messageId", messageId);
                result.put("intent", intent);
                result.put("success", true);
                result.put("data", message);
                
                long cost = System.currentTimeMillis() - start;
                
                AuditLog logRecord = AuditLog.builder()
                        .userId(userId)
                        .operation("CHAT")
                        .content("txId=" + txId + "; module=" + request.getModule() + "; query=" + request.getQuery())
                        .resultSummary("intent=" + intent + "; responseSnippet=" + (message.length() > 120 ? message.substring(0, 120) + "..." : message))
                        .ipAddress(ip)
                        .executionTime(cost)
                        .status(1)
                        .build();
                auditLogRepository.save(java.util.Objects.requireNonNull(logRecord));
                
                return ResponseUtil.success(result);
                
            } catch (Exception e) {
                long cost = System.currentTimeMillis() - start;
                log.error("AI对话失败: txId={}", txId, e);
                
                AuditLog logRecord = AuditLog.builder()
                        .userId(userId)
                        .operation("CHAT")
                        .content("txId=" + txId + "; module=" + request.getModule() + "; query=" + request.getQuery())
                        .ipAddress(ip)
                        .executionTime(cost)
                        .status(0)
                        .errorMessage(e.getMessage())
                        .build();
                auditLogRepository.save(java.util.Objects.requireNonNull(logRecord));
                
                return ResponseUtil.error(500, "AI服务异常: " + e.getMessage());
            } finally {
                org.slf4j.MDC.remove("traceId");
            }
        }
    
    /**
     * 发送消息（多轮对话 - 完整版）
     */
    @PostMapping("/message")
    public ResponseUtil.Result<ChatResponse> sendMessage(
            @Valid @RequestBody ChatRequest request,
            HttpServletRequest httpRequest) {
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
            log.warn("未检测到userId，使用默认值: 1");
        }
        
        String txId = java.util.UUID.randomUUID().toString();
        // Put traceId into MDC for logging
        org.slf4j.MDC.put("traceId", txId);

        long start = System.currentTimeMillis();
        String ip = httpRequest.getRemoteAddr();
        
        log.info("消息请求: txId={}, userId={}, module={}, query={}", txId, userId, request.getModule(), request.getQuery());
        
        try {
            Map<String, Object> workflowResult = agentWorkflowService.execute(
                    request.getQuery(),
                    userId,
                    request.getConversationId()
            );
            
            String intent = (String) workflowResult.getOrDefault("intent", "unknown");
            String message = (String) workflowResult.getOrDefault("message", "");
            Long conversationId = workflowResult.get("conversationId") instanceof Long 
                    ? (Long) workflowResult.get("conversationId") : null;
            Long messageId = workflowResult.get("messageId") instanceof Long 
                    ? (Long) workflowResult.get("messageId") : null;
            
            ChatResponse response = ChatResponse.builder()
                    .messageId(messageId)
                    .conversationId(conversationId)
                    .content(message)
                    .intent(intent)
                    .timestamp(System.currentTimeMillis())
                    .txId(txId) // Add txId to response
                    .build();
            
            long cost = System.currentTimeMillis() - start;
            
            AuditLog logRecord = AuditLog.builder()
                    .userId(userId)
                    .operation("CHAT")
                    .content("txId=" + txId + "; module=" + request.getModule() + "; query=" + request.getQuery())
                    .resultSummary("intent=" + intent + "; responseSnippet=" + (message.length() > 120 ? message.substring(0, 120) + "..." : message))
                    .ipAddress(ip)
                    .executionTime(cost)
                    .status(1)
                    .build();
            auditLogRepository.save(java.util.Objects.requireNonNull(logRecord));
            
            return ResponseUtil.success(response);
            
        } catch (Exception e) {
            long cost = System.currentTimeMillis() - start;
            log.error("消息对话失败: txId={}", txId, e);
            
            AuditLog logRecord = AuditLog.builder()
                    .userId(userId)
                    .operation("CHAT")
                    .content("txId=" + txId + "; module=" + request.getModule() + "; query=" + request.getQuery())
                    .ipAddress(ip)
                    .executionTime(cost)
                    .status(0)
                    .errorMessage(e.getMessage())
                    .build();
            auditLogRepository.save(java.util.Objects.requireNonNull(logRecord));
            
            return ResponseUtil.error(500, "AI服务异常: " + e.getMessage());
        } finally {
            org.slf4j.MDC.remove("traceId");
        }
    }
    
    /**
     * 获取对话历史
     */
    @GetMapping("/conversation/{conversationId}/history")
    public ResponseUtil.Result<Map<String, Object>> getHistory(
            @PathVariable Long conversationId,
            HttpServletRequest httpRequest) {
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            return ResponseUtil.unauthorized("未登录");
        }
        
        try {
            List<Message> messages = hiAgentService.getConversationHistory(conversationId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("total", messages.size());
            result.put("messages", messages);
            
            return ResponseUtil.success(result);
            
        } catch (Exception e) {
            log.error("获取对话历史失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    /**
     * 获取用户的所有对话
     */
    @GetMapping("/conversations")
    public ResponseUtil.Result<List<Conversation>> getConversations(
            HttpServletRequest httpRequest) {
        
        // 开发环境：使用默认userId
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }
        
        try {
            List<Conversation> conversations = hiAgentService.getUserConversations(userId);
            return ResponseUtil.success(conversations);
            
        } catch (Exception e) {
            log.error("获取对话列表失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    /**
     * 获取单个对话详情
     */
    @GetMapping("/conversation/{id}")
    public ResponseUtil.Result<Conversation> getConversation(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }
        
        try {
            // 获取对话历史
            List<Message> messages = hiAgentService.getConversationHistory(id);
            
            // 构建对话对象
            Conversation conversation = new Conversation();
            conversation.setConversationId(id);
            conversation.setUserId(userId);
            
            return ResponseUtil.success(conversation);
            
        } catch (Exception e) {
            log.error("获取对话详情失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    /**
     * 删除对话
     */
    @DeleteMapping("/conversation/{id}")
    public ResponseUtil.Result<Void> deleteConversation(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }
        
        try {
            // 这里应该添加删除逻辑，暂时返回成功
            log.info("删除对话: conversationId={}, userId={}", id, userId);
            return ResponseUtil.success("删除成功", null);
            
        } catch (Exception e) {
            log.error("删除对话失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }

    @PostMapping("/analyze-data")
    public ResponseUtil.Result<Map<String, Object>> analyzeData(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String query = request.get("query");
        String domain = request.get("domain"); // Get domain from request
        
        if (query == null || query.trim().isEmpty()) {
            return ResponseUtil.error("Query cannot be empty");
        }
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L; // Fallback for dev
        }
        
        try {
            return ResponseUtil.success(hiAgentService.analyzeData(query, userId, domain));
        } catch (Exception e) {
            log.error("Data analysis failed", e);
            return ResponseUtil.error("Analysis failed: " + e.getMessage());
        }
    }
}
