package com.bank.bi.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 审计日志实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sys_audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username")
    private String username;

    @Column(name = "operation", nullable = false)
    private String operation; // 例如：QUERY, EXPORT, LOGIN

    @Column(name = "content", columnDefinition = "TEXT")
    private String content; // 查询内容或操作详情

    @Column(name = "sql_statement", columnDefinition = "TEXT")
    private String sqlStatement; // 执行的SQL（如果有）

    @Column(name = "result_summary", columnDefinition = "TEXT")
    private String resultSummary; // 结果摘要（如：返回10行数据）

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "execution_time")
    private Long executionTime; // 执行耗时(ms)

    @Column(name = "status")
    private Integer status; // 1:成功, 0:失败

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @CreationTimestamp
    @Column(name = "created_time", updatable = false)
    private LocalDateTime createdTime;
}
