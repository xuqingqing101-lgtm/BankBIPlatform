package com.bank.bi.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * 知识库文档实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bi_knowledge_document")
public class KnowledgeDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType; // pdf, docx, xlsx, etc.

    @Column(nullable = false)
    private String filePath; // 本地存储路径

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content; // 提取的文本内容，用于检索

    @Column(nullable = false)
    private Long uploadedBy; // 上传者ID

    private LocalDateTime createdTime;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "bi_knowledge_document_role",
            joinColumns = @JoinColumn(name = "document_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> allowedRoles = new HashSet<>();
}
