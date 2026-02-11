package com.bank.bi.controller;

import com.bank.bi.model.entity.Panel;
import com.bank.bi.model.entity.PanelItem;
import com.bank.bi.service.PanelService;
import com.bank.bi.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/panels")
@RequiredArgsConstructor
public class PanelController {

    private final PanelService panelService;

    @GetMapping
    public ResponseUtil.Result<List<Panel>> getUserPanels(HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            return ResponseUtil.success(panelService.getUserPanels(userId));
        } catch (Exception e) {
            log.error("Failed to get panels", e);
            return ResponseUtil.error("Failed to get panels");
        }
    }

    @PostMapping
    public ResponseUtil.Result<Panel> createPanel(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            String name = (String) body.get("name");
            String typeStr = (String) body.get("type");
            Panel.PanelType type = Panel.PanelType.valueOf(typeStr.toUpperCase());
            
            return ResponseUtil.success(panelService.createPanel(name, userId, type));
        } catch (Exception e) {
            log.error("Failed to create panel", e);
            return ResponseUtil.error("Failed to create panel: " + e.getMessage());
        }
    }

    @PostMapping("/{panelId}/items")
    public ResponseUtil.Result<PanelItem> pinItem(
            @PathVariable Long panelId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            String question = body.get("question");
            String chartType = body.get("chartType");
            String layoutConfig = body.get("layoutConfig");
            
            return ResponseUtil.success(panelService.pinItem(panelId, question, chartType, layoutConfig, userId));
        } catch (Exception e) {
            log.error("Failed to pin item", e);
            return ResponseUtil.error("Failed to pin item: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{panelId}")
    public ResponseUtil.Result<Void> deletePanel(@PathVariable Long panelId, HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            panelService.deletePanel(panelId, userId);
            return ResponseUtil.success(null);
        } catch (Exception e) {
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    @DeleteMapping("/items/{itemId}")
    public ResponseUtil.Result<Void> deleteItem(@PathVariable Long itemId, HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            panelService.deleteItem(itemId, userId);
            return ResponseUtil.success(null);
        } catch (Exception e) {
            return ResponseUtil.error(e.getMessage());
        }
    }

    private Long getUserId(HttpServletRequest request) {
        // Mock user ID from header or attribute (AuthFilter usually sets this)
        Object userIdObj = request.getAttribute("userId");
        if (userIdObj != null) return (Long) userIdObj;
        return 1L; // Default Admin
    }
}
