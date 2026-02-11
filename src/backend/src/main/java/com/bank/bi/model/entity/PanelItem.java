package com.bank.bi.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bi_panel_items")
public class PanelItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonIgnore
    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "panel_id", nullable = false)
    private Panel panel;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question; // The pinned question
    
    @Column(name = "chart_type")
    private String chartType; // bar, line, pie, table, etc.
    
    @Column(name = "layout_config", columnDefinition = "TEXT")
    private String layoutConfig; // JSON for x, y, w, h
    
    @CreationTimestamp
    @Column(name = "created_time", updatable = false)
    private LocalDateTime createdTime;
}
