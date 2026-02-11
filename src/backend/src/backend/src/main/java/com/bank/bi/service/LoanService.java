package com.bank.bi.service;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * 贷款业务服务
 */
@Service
public class LoanService {

    /**
     * 获取贷款概览数据
     */
    public Map<String, Object> getSummary() {
        Map<String, Object> data = new HashMap<>();
        
        // 贷款余额
        data.put("totalBalance", "380亿");
        data.put("balanceGrowth", "+12.3%");
        
        // 不良率
        data.put("nplRate", "1.35%");
        data.put("nplChange", "-0.08pp");
        
        // 拨备覆盖率
        data.put("provisionCoverage", "185%");
        data.put("provisionChange", "+5.2pp");
        
        // 高风险客户
        data.put("highRiskCount", "15户");
        data.put("highRiskAmount", "2.3亿");
        
        data.put("analysis", "贷款质量良好，风险指标持续优化，风险可控");
        
        return data;
    }

    /**
     * 获取资产质量数据
     */
    public Map<String, Object> getQuality() {
        Map<String, Object> data = new HashMap<>();
        
        List<String> categories = Arrays.asList("正常", "关注", "次级", "可疑", "损失");
        List<Double> values = Arrays.asList(350.0, 25.0, 3.0, 1.5, 0.5); // 亿
        
        data.put("categories", categories);
        data.put("values", values);
        
        return data;
    }

    /**
     * 获取风险指标
     */
    public Map<String, Object> getRisk() {
        Map<String, Object> data = new HashMap<>();
        
        // 模拟风险迁徙率
        data.put("normalToSpecial", "1.2%");
        data.put("specialToNpl", "15.5%");
        data.put("nplCashRecovery", "35.0%");
        
        return data;
    }
}
