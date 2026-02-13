package com.bank.bi.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * AI问答响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    
    private Long messageId;
    
    private Long conversationId;
    
    private String content;  // AI回复内容
    
    private String intent;  // 意图识别
    
    private List<String> suggestions;  // 推荐追问
    
    private Long timestamp;
    
    private String txId; // Transaction ID for tracing
}
