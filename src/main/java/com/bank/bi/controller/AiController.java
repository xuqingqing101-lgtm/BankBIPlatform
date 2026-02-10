package com.bank.bi.controller;

import com.bank.bi.model.dto.ChatRequest;
import com.bank.bi.model.dto.ChatResponse;
import com.bank.bi.model.entity.Conversation;
import com.bank.bi.model.entity.Message;
import com.bank.bi.service.HiAgentService;
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
    
    /**
     * 发送消息（简化版，兼容前端）
     */
    @PostMapping("/chat")
    public ResponseUtil.Result<Map<String, Object>> chat(
            @Valid @RequestBody ChatRequest request,
            HttpServletRequest httpRequest) {
        
        // 开发环境：如果没有userId，使用默认值1
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
            log.warn("未检测到userId，使用默认值: 1");
        }
        
        log.info("用户{}发送消息: {}", userId, request.getQuery());
        
        try {
            // 调用HiAgent进行多轮对话
            Message aiMessage = hiAgentService.multiRoundChat(
                    request.getQuery(),
                    request.getModule(),
                    request.getConversationId(),
                    userId
            );
            
            // 构建响应（匹配前端期望的格式）
            Map<String, Object> result = new HashMap<>();
            result.put("sessionId", "session-" + aiMessage.getConversationId());
            result.put("response", aiMessage.getContent());
            result.put("conversationId", aiMessage.getConversationId());
            result.put("messageId", aiMessage.getMessageId());
            result.put("intent", aiMessage.getIntent());
            result.put("success", true);
            result.put("data", aiMessage.getContent());
            
            return ResponseUtil.success(result);
            
        } catch (Exception e) {
            log.error("AI对话失败", e);
            return ResponseUtil.error(500, "AI服务异常: " + e.getMessage());
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
        
        log.info("用户{}发送消息: {}", userId, request.getQuery());
        
        try {
            // 调用HiAgent进行多轮对话
            Message aiMessage = hiAgentService.multiRoundChat(
                    request.getQuery(),
                    request.getModule(),
                    request.getConversationId(),
                    userId
            );
            
            // 构建响应
            ChatResponse response = ChatResponse.builder()
                    .messageId(aiMessage.getMessageId())
                    .conversationId(aiMessage.getConversationId())
                    .content(aiMessage.getContent())
                    .intent(aiMessage.getIntent())
                    .timestamp(System.currentTimeMillis())
                    .build();
            
            return ResponseUtil.success(response);
            
        } catch (Exception e) {
            log.error("AI对话失败", e);
            return ResponseUtil.error(500, "AI服务异常: " + e.getMessage());
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
    public ResponseUtil.Result<Map<String, Object>> analyzeData(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseUtil.error("Query cannot be empty");
        }
        try {
            return ResponseUtil.success(hiAgentService.analyzeData(query));
        } catch (Exception e) {
            log.error("Data analysis failed", e);
            return ResponseUtil.error("Analysis failed: " + e.getMessage());
        }
    }
}
