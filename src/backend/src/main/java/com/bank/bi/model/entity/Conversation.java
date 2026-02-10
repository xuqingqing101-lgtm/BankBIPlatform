package com.bank.bi.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * AI对话会话实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ai_conversation")
public class Conversation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversation_id")
    private Long conversationId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "session_id", unique = true, length = 100)
    private String sessionId;
    
    @Column(name = "module", length = 50)
    private String module;  // deposit, loan, intermediate, customer, dashboard, knowledge
    
    @Column(name = "title", length = 200)
    private String title;  // 会话标题（首个问题）
    
    @Column(name = "status")
    @Builder.Default
    private Integer status = 1;  // 1进行中 2已结束
    
    @Column(name = "message_count")
    @Builder.Default
    private Integer messageCount = 0;
    
    @CreationTimestamp
    @Column(name = "started_time", updatable = false)
    private LocalDateTime startedTime;
    
    @Column(name = "ended_time")
    private LocalDateTime endedTime;
}
