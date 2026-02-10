package com.bank.bi.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 用户信息视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoVO {
    
    private Long userId;
    
    private String username;
    
    private String realName;
    
    private String department;
    
    private String position;
    
    private String email;
    
    private List<String> roles;
    
    private List<String> permissions;
}
