package com.bank.bi.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * HiAgent API请求
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HiAgentRequest {
    
    private String model;
    
    private List<Message> messages;
    
    private Double temperature;
    
    @JsonProperty("max_tokens")
    private Integer maxTokens;
    
    private Boolean stream;
    
    /**
     * 消息对象
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String role;  // system, user, assistant
        private String content;
    }
}
