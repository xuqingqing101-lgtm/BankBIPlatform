package com.bank.bi.service;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * 经营管理服务
 */
@Service
public class ManagementService {

    public Map<String, Object> getDashboard() {
        Map<String, Object> data = new HashMap<>();
        
        // 1. KPI Data
        List<Map<String, Object>> kpiData = new ArrayList<>();
        kpiData.add(createKpi("总资产", "¥5.89万亿", "+6.8%", "up"));
        kpiData.add(createKpi("存款余额", "¥4.58万亿", "+8.5%", "up"));
        kpiData.add(createKpi("贷款余额", "¥3.82万亿", "+10.2%", "up"));
        kpiData.add(createKpi("净利润", "¥138亿", "+12.3%", "up"));
        data.put("kpiData", kpiData);

        // 2. Revenue Trend Data
        List<Map<String, Object>> revenueData = new ArrayList<>();
        revenueData.add(createRevenue("1月", 48.2, 28.5, 19.7));
        revenueData.add(createRevenue("2月", 45.8, 27.2, 18.6));
        revenueData.add(createRevenue("3月", 52.1, 30.8, 21.3));
        revenueData.add(createRevenue("4月", 49.6, 29.5, 20.1));
        revenueData.add(createRevenue("5月", 55.3, 32.1, 23.2));
        revenueData.add(createRevenue("6月", 58.9, 33.8, 25.1));
        data.put("revenueData", revenueData);

        // 3. Business Structure Data
        List<Map<String, Object>> businessData = new ArrayList<>();
        businessData.add(createPieItem("利息净收入", 68, "#3b82f6"));
        businessData.add(createPieItem("手续费收入", 18, "#10b981"));
        businessData.add(createPieItem("投资收益", 10, "#f59e0b"));
        businessData.add(createPieItem("其他收入", 4, "#8b5cf6"));
        data.put("businessData", businessData);

        // 4. Asset Allocation Data
        List<Map<String, Object>> assetData = new ArrayList<>();
        assetData.add(createPieItem("贷款", 65, "#3b82f6"));
        assetData.add(createPieItem("债券投资", 20, "#10b981"));
        assetData.add(createPieItem("同业资产", 10, "#f59e0b"));
        assetData.add(createPieItem("现金及准备金", 5, "#8b5cf6"));
        data.put("assetData", assetData);
        
        return data;
    }

    private Map<String, Object> createKpi(String title, String value, String change, String trend) {
        Map<String, Object> map = new HashMap<>();
        map.put("title", title);
        map.put("value", value);
        map.put("change", change);
        map.put("trend", trend);
        return map;
    }

    private Map<String, Object> createRevenue(String month, double revenue, double cost, double profit) {
        Map<String, Object> map = new HashMap<>();
        map.put("month", month);
        map.put("revenue", revenue);
        map.put("cost", cost);
        map.put("profit", profit);
        return map;
    }

    private Map<String, Object> createPieItem(String name, int value, String color) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("value", value);
        map.put("color", color);
        return map;
    }
}
