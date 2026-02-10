package com.bank.bi.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * AI对话消息实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ai_message", indexes = {
    @Index(name = "idx_conversation_id", columnList = "conversation_id"),
    @Index(name = "idx_created_time", columnList = "created_time")
})
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;
    
    @Column(name = "conversation_id", nullable = false)
    private Long conversationId;
    
    @Column(name = "message_type", nullable = false, length = 20)
    private String type;  // user, assistant
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "query_text", columnDefinition = "TEXT")
    private String queryText;  // 用户问题（assistant消息关联）
    
    @Column(name = "intent", length = 50)
    private String intent;  // 意图识别结果
    
    @Column(name = "model_name", length = 50)
    private String modelName;  // 使用的AI模型
    
    @Column(name = "tokens_used")
    private Integer tokensUsed;  // token使用量
    
    @Column(name = "response_time")
    private Integer responseTime;  // 响应时间(ms)
    
    @CreationTimestamp
    @Column(name = "created_time", updatable = false)
    private LocalDateTime createdTime;
}
