package com.bank.bi.service;

import com.bank.bi.model.entity.User;
import com.bank.bi.model.vo.UserInfoVO;
import com.bank.bi.repository.UserRepository;
import com.bank.bi.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 认证服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * 用户登录
     */
    public Map<String, Object> login(String username, String password, String ipAddress) {
        try {
            // 认证
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            
            // 查找用户
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("用户不存在"));
            
            // 更新登录信息
            user.setLastLoginTime(LocalDateTime.now());
            user.setLastLoginIp(ipAddress);
            userRepository.save(user);
            
            // 生成Token
            String token = jwtTokenProvider.generateToken(user.getUserId(), user.getUsername());
            
            // 构建用户信息
            UserInfoVO userInfo = UserInfoVO.builder()
                    .userId(user.getUserId())
                    .username(user.getUsername())
                    .realName(user.getRealName())
                    .department(user.getDepartment())
                    .position(user.getPosition())
                    .email(user.getEmail())
                    .roles(user.getRoles().stream()
                            .map(role -> role.getRoleCode())
                            .collect(Collectors.toList()))
                    .build();
            
            // 构建响应
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userInfo", userInfo);
            
            log.info("用户登录成功: {}", username);
            
            return result;
            
        } catch (Exception e) {
            log.error("用户登录失败: {}", username, e);
            throw new RuntimeException("用户名或密码错误");
        }
    }
    
    /**
     * 获取当前用户信息
     */
    public UserInfoVO getCurrentUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        return UserInfoVO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .realName(user.getRealName())
                .department(user.getDepartment())
                .position(user.getPosition())
                .email(user.getEmail())
                .roles(user.getRoles().stream()
                        .map(role -> role.getRoleCode())
                        .collect(Collectors.toList()))
                .build();
    }
}
