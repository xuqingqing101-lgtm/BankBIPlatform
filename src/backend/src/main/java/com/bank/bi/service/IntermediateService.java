package com.bank.bi.service;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * 中间业务服务
 */
@Service
public class IntermediateService {

    public Map<String, Object> getSummary() {
        Map<String, Object> data = new HashMap<>();
        
        data.put("income", "18.5亿");
        data.put("incomeGrowth", "+22.5%");
        
        data.put("wealthScale", "285亿");
        data.put("wealthGrowth", "+18.2%");
        
        data.put("cardCount", "528万张");
        data.put("cardGrowth", "+12.8%");
        
        data.put("analysis", "中间业务增长强劲，理财、银行卡、汇款业务全面增长");
        
        return data;
    }

    public Map<String, Object> getIncome() {
        Map<String, Object> data = new HashMap<>();
        data.put("wealth", "45%");
        data.put("cards", "30%");
        data.put("settlement", "25%");
        return data;
    }
}
