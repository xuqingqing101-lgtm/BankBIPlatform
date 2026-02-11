package com.bank.bi.service;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * 存款业务服务
 */
@Service
public class DepositService {

    /**
     * 获取存款概览数据
     */
    public Map<String, Object> getSummary() {
        Map<String, Object> data = new HashMap<>();
        
        // 模拟数据 - 匹配SRS和前端展示
        data.put("totalBalance", "520亿");
        data.put("growthRate", "+9.5%");
        data.put("growthTrend", "up"); // up/down
        
        data.put("corporateBalance", "312亿");
        data.put("corporateRatio", "60%");
        
        data.put("retailBalance", "208亿");
        data.put("retailRatio", "40%");
        
        data.put("analysis", "存款增长稳健，对公零售结构合理，存款稳定性良好");
        
        return data;
    }

    /**
     * 获取存款趋势数据
     */
    public Map<String, Object> getTrend() {
        Map<String, Object> data = new HashMap<>();
        
        List<String> months = Arrays.asList("1月", "2月", "3月", "4月", "5月", "6月");
        List<Double> balances = Arrays.asList(480.5, 485.2, 492.8, 505.0, 512.5, 520.0);
        
        data.put("xAxis", months);
        data.put("series", balances);
        
        return data;
    }

    /**
     * 获取存款结构数据
     */
    public List<Map<String, Object>> getStructure() {
        List<Map<String, Object>> list = new ArrayList<>();
        
        Map<String, Object> item1 = new HashMap<>();
        item1.put("name", "活期存款");
        item1.put("value", 180);
        list.add(item1);
        
        Map<String, Object> item2 = new HashMap<>();
        item2.put("name", "定期存款");
        item2.put("value", 240);
        list.add(item2);
        
        Map<String, Object> item3 = new HashMap<>();
        item3.put("name", "结构性存款");
        item3.put("value", 80);
        list.add(item3);
        
        Map<String, Object> item4 = new HashMap<>();
        item4.put("name", "大额存单");
        item4.put("value", 20);
        list.add(item4);
        
        return list;
    }
}
