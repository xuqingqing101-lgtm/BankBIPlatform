package com.bank.bi.controller;

import com.bank.bi.model.dto.LoginRequest;
import com.bank.bi.model.vo.UserInfoVO;
import com.bank.bi.service.AuthService;
import com.bank.bi.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseUtil.Result<Map<String, Object>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        
        log.info("用户登录请求: {}", request.getUsername());
        
        try {
            String ipAddress = getClientIp(httpRequest);
            Map<String, Object> result = authService.login(
                    request.getUsername(), 
                    request.getPassword(), 
                    ipAddress
            );
            
            return ResponseUtil.success(result);
            
        } catch (Exception e) {
            log.error("登录失败", e);
            return ResponseUtil.error(401, e.getMessage());
        }
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    public ResponseUtil.Result<UserInfoVO> getCurrentUser(HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            if (userId == null) {
                return ResponseUtil.unauthorized("未登录");
            }
            
            UserInfoVO userInfo = authService.getCurrentUserInfo(userId);
            return ResponseUtil.success(userInfo);
            
        } catch (Exception e) {
            log.error("获取用户信息失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }
    
    /**
     * 登出
     */
    @PostMapping("/logout")
    public ResponseUtil.Result<Void> logout() {
        // JWT是无状态的，登出主要由前端处理（删除token）
        // 如果需要服务端黑名单，可以将token加入Redis黑名单
        return ResponseUtil.success("登出成功", null);
    }
    
    /**
     * 认证服务健康检查
     */
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "认证服务");
        response.put("message", "认证服务运行正常");
        return response;
    }
    
    /**
     * 获取客户端IP
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
