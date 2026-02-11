package com.bank.bi.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Pin面板项目请求DTO
 */
@Data
public class PanelItemRequest {
    
    @NotBlank(message = "分类不能为空")
    private String category;
    
    @NotBlank(message = "标题不能为空")
    private String title;
    
    @NotBlank(message = "内容不能为空")
    private String content;
    
    private String queryText;  // 原始查询
    
    private Integer positionX;
    
    private Integer positionY;
    
    private Integer width;
    
    private Integer height;
}
