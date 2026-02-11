package com.bank.bi.controller;

import com.bank.bi.service.ManagementService;
import com.bank.bi.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 经营管理驾驶舱控制器
 */
@Slf4j
@RestController
@RequestMapping("/management")
@RequiredArgsConstructor
public class ManagementController {

    private final ManagementService managementService;

    @GetMapping("/dashboard")
    public ResponseUtil.Result<Map<String, Object>> getDashboard() {
        try {
            return ResponseUtil.success(managementService.getDashboard());
        } catch (Exception e) {
            log.error("获取驾驶舱数据失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
}
