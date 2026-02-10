package com.bank.bi.controller;

import com.bank.bi.service.DepositService;
import com.bank.bi.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 存款业务分析控制器
 */
@Slf4j
@RestController
@RequestMapping("/deposit")
@RequiredArgsConstructor
public class DepositController {

    private final DepositService depositService;

    /**
     * 获取存款概览
     */
    @GetMapping("/summary")
    public ResponseUtil.Result<Map<String, Object>> getSummary() {
        try {
            return ResponseUtil.success(depositService.getSummary());
        } catch (Exception e) {
            log.error("获取存款概览失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }

    /**
     * 获取存款趋势
     */
    @GetMapping("/trend")
    public ResponseUtil.Result<Map<String, Object>> getTrend() {
        try {
            return ResponseUtil.success(depositService.getTrend());
        } catch (Exception e) {
            log.error("获取存款趋势失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }

    /**
     * 获取存款结构
     */
    @GetMapping("/structure")
    public ResponseUtil.Result<List<Map<String, Object>>> getStructure() {
        try {
            return ResponseUtil.success(depositService.getStructure());
        } catch (Exception e) {
            log.error("获取存款结构失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
}
