package com.bank.bi.controller;

import com.bank.bi.service.LoanService;
import com.bank.bi.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 贷款业务分析控制器
 */
@Slf4j
@RestController
@RequestMapping("/loan")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    /**
     * 获取贷款概览
     */
    @GetMapping("/summary")
    public ResponseUtil.Result<Map<String, Object>> getSummary() {
        try {
            return ResponseUtil.success(loanService.getSummary());
        } catch (Exception e) {
            log.error("获取贷款概览失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }

    /**
     * 获取资产质量
     */
    @GetMapping("/quality")
    public ResponseUtil.Result<Map<String, Object>> getQuality() {
        try {
            return ResponseUtil.success(loanService.getQuality());
        } catch (Exception e) {
            log.error("获取资产质量失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }

    /**
     * 获取风险指标
     */
    @GetMapping("/risk")
    public ResponseUtil.Result<Map<String, Object>> getRisk() {
        try {
            return ResponseUtil.success(loanService.getRisk());
        } catch (Exception e) {
            log.error("获取风险指标失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
}
