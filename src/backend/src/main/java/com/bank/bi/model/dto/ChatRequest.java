package com.bank.bi.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * AI问答请求DTO
 */
@Data
public class ChatRequest {
    
    @NotBlank(message = "问题不能为空")
    private String query;
    
    private String module;  // deposit, loan, intermediate, customer, dashboard, knowledge
    
    private Long conversationId;  // 可选，用于多轮对话
}
