package com.bank.bi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 欢迎页面控制器
 */
@RestController
@RequestMapping
public class WelcomeController {
    
    @GetMapping("/")
    public Map<String, Object> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "银行智能AI分析平台");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("message", "系统运行正常");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("健康检查", "GET /api/health");
        endpoints.put("用户登录", "POST /api/auth/login");
        endpoints.put("AI聊天", "POST /api/ai/chat");
        endpoints.put("获取对话", "GET /api/ai/conversations");
        endpoints.put("Pin管理", "GET /api/panel/items");
        endpoints.put("H2控制台", "GET /api/h2-console");
        
        response.put("endpoints", endpoints);
        
        Map<String, String> info = new HashMap<>();
        info.put("API文档", "开发中");
        info.put("前端地址", "http://localhost:5173");
        info.put("后端地址", "http://localhost:8080/api");
        info.put("测试命令", "curl http://localhost:8080/api/health");
        
        response.put("info", info);
        
        return response;
    }
    
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", new java.util.Date().toString());
        response.put("message", "银行智能AI分析平台运行正常");
        return response;
    }
}
