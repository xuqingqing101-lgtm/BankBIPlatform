package com.bank.bi.repository;

import com.bank.bi.model.entity.KnowledgeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface KnowledgeDocumentRepository extends JpaRepository<KnowledgeDocument, Long> {

    /**
     * 根据关键词搜索文档，并过滤权限
     * @param keyword 关键词
     * @param roleIds 用户拥有的角色ID集合
     * @return 符合条件的文档列表
     */
    @Query("SELECT DISTINCT d FROM KnowledgeDocument d JOIN d.allowedRoles r " +
           "WHERE (d.title LIKE %:keyword% OR d.content LIKE %:keyword%) " +
           "AND r.roleId IN :roleIds")
    List<KnowledgeDocument> searchByKeywordAndRoles(@Param("keyword") String keyword, @Param("roleIds") Set<Long> roleIds);

    /**
     * 获取用户有权限访问的所有文档
     */
    @Query("SELECT DISTINCT d FROM KnowledgeDocument d JOIN d.allowedRoles r WHERE r.roleId IN :roleIds")
    List<KnowledgeDocument> findByRoles(@Param("roleIds") Set<Long> roleIds);

    boolean existsByFileName(String fileName);
}
