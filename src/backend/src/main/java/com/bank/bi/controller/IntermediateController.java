package com.bank.bi.controller;

import com.bank.bi.service.IntermediateService;
import com.bank.bi.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 中间业务控制器
 */
@Slf4j
@RestController
@RequestMapping("/intermediate")
@RequiredArgsConstructor
public class IntermediateController {

    private final IntermediateService intermediateService;

    @GetMapping("/summary")
    public ResponseUtil.Result<Map<String, Object>> getSummary() {
        try {
            return ResponseUtil.success(intermediateService.getSummary());
        } catch (Exception e) {
            log.error("获取中间业务概览失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }

    @GetMapping("/income")
    public ResponseUtil.Result<Map<String, Object>> getIncome() {
        try {
            return ResponseUtil.success(intermediateService.getIncome());
        } catch (Exception e) {
            log.error("获取收入分析失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
}
