package com.bank.bi.service;

import com.bank.bi.model.entity.PanelItem;
import com.bank.bi.repository.PanelItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Pin面板服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PanelService {
    
    private final PanelItemRepository panelItemRepository;
    
    /**
     * 获取用户的所有Pin项目
     */
    public List<PanelItem> getUserPanelItems(Long userId) {
        return panelItemRepository.findByUserIdOrderBySortOrderAsc(userId);
    }
    
    /**
     * 添加Pin项目
     */
    @Transactional
    public PanelItem addPanelItem(Long userId, PanelItem item) {
        item.setUserId(userId);
        
        // 如果没有指定位置，自动计算
        if (item.getPositionY() == null) {
            long count = panelItemRepository.countByUserId(userId);
            item.setPositionY((int) count);
        }
        
        if (item.getPositionX() == null) {
            item.setPositionX(0);
        }
        
        if (item.getWidth() == null) {
            item.setWidth(2);
        }
        
        if (item.getHeight() == null) {
            item.setHeight(1);
        }
        
        PanelItem saved = panelItemRepository.save(item);
        log.info("用户{}添加Pin项目: {}", userId, saved.getItemId());
        
        return saved;
    }
    
    /**
     * 更新Pin项目
     */
    @Transactional
    public PanelItem updatePanelItem(Long userId, Long itemId, PanelItem updates) {
        PanelItem item = panelItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Pin项目不存在"));
        
        // 验证所有权
        if (!item.getUserId().equals(userId)) {
            throw new RuntimeException("无权限修改此Pin项目");
        }
        
        // 更新字段
        if (updates.getTitle() != null) {
            item.setTitle(updates.getTitle());
        }
        if (updates.getContent() != null) {
            item.setContent(updates.getContent());
        }
        if (updates.getPositionX() != null) {
            item.setPositionX(updates.getPositionX());
        }
        if (updates.getPositionY() != null) {
            item.setPositionY(updates.getPositionY());
        }
        if (updates.getWidth() != null) {
            item.setWidth(updates.getWidth());
        }
        if (updates.getHeight() != null) {
            item.setHeight(updates.getHeight());
        }
        
        PanelItem saved = panelItemRepository.save(item);
        log.info("用户{}更新Pin项目: {}", userId, itemId);
        
        return saved;
    }
    
    /**
     * 删除Pin项目
     */
    @Transactional
    public void deletePanelItem(Long userId, Long itemId) {
        PanelItem item = panelItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Pin项目不存在"));
        
        // 验证所有权
        if (!item.getUserId().equals(userId)) {
            throw new RuntimeException("无权限删除此Pin项目");
        }
        
        panelItemRepository.delete(item);
        log.info("用户{}删除Pin项目: {}", userId, itemId);
    }
    
    /**
     * 批量更新布局
     */
    @Transactional
    public void updateLayout(Long userId, List<PanelItem> items) {
        for (PanelItem item : items) {
            PanelItem existing = panelItemRepository.findById(item.getItemId())
                    .orElse(null);
            
            if (existing != null && existing.getUserId().equals(userId)) {
                existing.setPositionX(item.getPositionX());
                existing.setPositionY(item.getPositionY());
                existing.setWidth(item.getWidth());
                existing.setHeight(item.getHeight());
                panelItemRepository.save(existing);
            }
        }
        
        log.info("用户{}更新布局，共{}个项目", userId, items.size());
    }
}
