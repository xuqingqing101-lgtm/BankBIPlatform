package com.bank.bi.controller;

import com.bank.bi.service.CustomerService;
import com.bank.bi.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 客户画像控制器
 */
@Slf4j
@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/overview")
    public ResponseUtil.Result<Map<String, Object>> getOverview() {
        try {
            return ResponseUtil.success(customerService.getOverview());
        } catch (Exception e) {
            log.error("获取客户概览失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
}
