package com.bank.bi.service;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * 客户画像服务
 */
@Service
public class CustomerService {

    public Map<String, Object> getOverview() {
        Map<String, Object> data = new HashMap<>();
        
        data.put("totalCount", "285万户");
        data.put("totalGrowth", "+8.5%");
        
        data.put("corporateCount", "3.8万户");
        data.put("corporateContribution", "65%收入");
        
        data.put("retailCount", "281万户");
        data.put("retailActiveRate", "72%");
        
        data.put("highNetWorthCount", "2850户");
        data.put("highNetWorthAUM", "185亿");
        
        data.put("analysis", "客户结构优质，高净值客户增长迅速，客户活跃度高");
        
        return data;
    }
}
