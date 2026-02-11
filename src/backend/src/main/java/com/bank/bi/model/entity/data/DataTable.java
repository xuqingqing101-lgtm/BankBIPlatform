package com.bank.bi.model.entity.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 数据表元数据
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bi_data_tables")
public class DataTable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String tableName; // 物理表名
    
    @Column(nullable = false)
    private String displayName; // 显示名称
    
    private String description;
    
    private Long rowCount;
    
    private LocalDateTime createdTime;

    @Column(name = "user_id")
    private Long userId; // 上传者ID，用于数据权限控制
    
    @OneToMany(mappedBy = "dataTable", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<DataColumn> columns;
}
