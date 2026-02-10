package com.bank.bi.controller;

import com.bank.bi.model.dto.PanelItemRequest;
import com.bank.bi.model.entity.PanelItem;
import com.bank.bi.service.PanelService;
import com.bank.bi.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Pin面板控制器
 */
@Slf4j
@RestController
@RequestMapping("/panel")
@RequiredArgsConstructor
public class PanelController {
    
    private final PanelService panelService;
    
    /**
     * 获取我的面板
     */
    @GetMapping("/my")
    public ResponseUtil.Result<Map<String, Object>> getMyPanel(HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }
        
        try {
            List<PanelItem> items = panelService.getUserPanelItems(userId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("panelId", 1);  // 简化处理，暂时固定为1
            result.put("panelName", "我的面板");
            result.put("items", items);
            
            return ResponseUtil.success(result);
            
        } catch (Exception e) {
            log.error("获取面板失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    /**
     * 获取Pin列表（兼容前端/panel/items调用）
     */
    @GetMapping("/items")
    public ResponseUtil.Result<List<PanelItem>> getItems(HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }
        
        try {
            List<PanelItem> items = panelService.getUserPanelItems(userId);
            return ResponseUtil.success(items);
            
        } catch (Exception e) {
            log.error("获取Pin列表失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    /**
     * 添加Pin项目（支持/item和/items两个路径）
     */
    @PostMapping({"/item", "/items"})
    public ResponseUtil.Result<PanelItem> addItem(
            @Valid @RequestBody PanelItemRequest request,
            HttpServletRequest httpRequest) {
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }
        
        try {
            PanelItem item = PanelItem.builder()
                    .category(request.getCategory())
                    .title(request.getTitle())
                    .content(request.getContent())
                    .queryText(request.getQueryText())
                    .positionX(request.getPositionX())
                    .positionY(request.getPositionY())
                    .width(request.getWidth())
                    .height(request.getHeight())
                    .build();
            
            PanelItem saved = panelService.addPanelItem(userId, item);
            return ResponseUtil.success(saved);
            
        } catch (Exception e) {
            log.error("添加Pin项目失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    /**
     * 更新Pin项目（支持/item和/items两个路径）
     */
    @PutMapping({"/item/{itemId}", "/items/{itemId}"})
    public ResponseUtil.Result<PanelItem> updateItem(
            @PathVariable Long itemId,
            @RequestBody PanelItem updates,
            HttpServletRequest httpRequest) {
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }
        
        try {
            PanelItem updated = panelService.updatePanelItem(userId, itemId, updates);
            return ResponseUtil.success(updated);
            
        } catch (Exception e) {
            log.error("更新Pin项目失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    /**
     * 更新Pin位置
     */
    @PutMapping({"/item/{itemId}/position", "/items/{itemId}/position"})
    public ResponseUtil.Result<PanelItem> updatePosition(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> position,
            HttpServletRequest httpRequest) {
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }
        
        try {
            PanelItem updates = new PanelItem();
            updates.setPositionX(position.get("x"));
            updates.setPositionY(position.get("y"));
            
            PanelItem updated = panelService.updatePanelItem(userId, itemId, updates);
            return ResponseUtil.success(updated);
            
        } catch (Exception e) {
            log.error("更新Pin位置失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    /**
     * 删除Pin项目（支持/item和/items两个路径）
     */
    @DeleteMapping({"/item/{itemId}", "/items/{itemId}"})
    public ResponseUtil.Result<Void> deleteItem(
            @PathVariable Long itemId,
            HttpServletRequest httpRequest) {
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }
        
        try {
            panelService.deletePanelItem(userId, itemId);
            return ResponseUtil.success("删除成功", null);
            
        } catch (Exception e) {
            log.error("删除Pin项目失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    /**
     * 批量更新布局
     */
    @PutMapping("/layout")
    public ResponseUtil.Result<Void> updateLayout(
            @RequestBody List<PanelItem> items,
            HttpServletRequest httpRequest) {
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        if (userId == null) {
            userId = 1L;
        }
        
        try {
            panelService.updateLayout(userId, items);
            return ResponseUtil.success("布局已保存", null);
            
        } catch (Exception e) {
            log.error("更新布局失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
}
