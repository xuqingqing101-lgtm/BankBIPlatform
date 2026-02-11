package com.bank.bi.model.entity.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "metrics")
public class Metric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    private String code;
    
    @Column(length = 1000)
    private String formula;
    
    private String type; // "原子指标", "衍生指标"
    
    private String description;
    
    private Long userId;
    
    private LocalDateTime createdTime;
}
