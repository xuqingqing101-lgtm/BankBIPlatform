package com.bank.bi.model.entity.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 数据列元数据
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bi_data_columns")
public class DataColumn {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "table_id", nullable = false)
    private DataTable dataTable;
    
    @Column(nullable = false)
    private String columnName; // 物理列名
    
    private String displayName; // 显示名称（业务含义）
    
    private String dataType; // 数据类型
    
    private String description;
}
