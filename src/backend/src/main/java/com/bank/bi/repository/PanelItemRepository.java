package com.bank.bi.repository;

import com.bank.bi.model.entity.PanelItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Pin面板项目数据访问层
 */
@Repository
public interface PanelItemRepository extends JpaRepository<PanelItem, Long> {
    
    /**
     * 根据用户ID查找所有Pin项目
     */
    List<PanelItem> findByUserIdOrderBySortOrderAsc(Long userId);
    
    /**
     * 根据用户ID和分类查找Pin项目
     */
    List<PanelItem> findByUserIdAndCategoryOrderBySortOrderAsc(Long userId, String category);
    
    /**
     * 统计用户的Pin项目数量
     */
    long countByUserId(Long userId);
}
