package com.bank.bi.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Pin面板项目实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "panel_item", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id")
})
public class PanelItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "category", length = 50)
    private String category;  // 业务模块：存款业务、贷款业务等
    
    @Column(name = "item_type", length = 20)
    @Builder.Default
    private String itemType = "qa";  // qa, chart, metric
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;  // 问题或标题
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;  // 答案或内容
    
    @Column(name = "query_text", columnDefinition = "TEXT")
    private String queryText;  // 原始查询
    
    @Column(name = "position_x")
    @Builder.Default
    private Integer positionX = 0;
    
    @Column(name = "position_y")
    @Builder.Default
    private Integer positionY = 0;
    
    @Column(name = "width")
    @Builder.Default
    private Integer width = 2;
    
    @Column(name = "height")
    @Builder.Default
    private Integer height = 1;
    
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
    
    @CreationTimestamp
    @Column(name = "created_time", updatable = false)
    private LocalDateTime createdTime;
    
    @UpdateTimestamp
    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
}
