package com.bank.bi.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Slf4j
@Service
public class DataManagementService {

    // 模拟内存存储
    private final List<Map<String, Object>> tables = new ArrayList<>();
    private final List<Map<String, Object>> metrics = new ArrayList<>();

    public DataManagementService() {
        // 初始化一些模拟数据
        tables.add(Map.of("id", "t1", "name", "deposit_2024.xlsx", "size", "2.5 MB", "date", "2024-03-15", "status", "已清洗", "rows", 12580));
        tables.add(Map.of("id", "t2", "name", "loan_summary_q1.csv", "size", "1.8 MB", "date", "2024-03-14", "status", "待处理", "rows", 5420));
    }

    public String uploadFile(MultipartFile file) {
        log.info("Receiving file: {}", file.getOriginalFilename());
        // 模拟文件处理
        Map<String, Object> newTable = new HashMap<>();
        newTable.put("id", "t" + System.currentTimeMillis());
        newTable.put("name", file.getOriginalFilename());
        newTable.put("size", (file.getSize() / 1024 / 1024) + " MB");
        newTable.put("date", new Date().toString());
        newTable.put("status", "待处理");
        newTable.put("rows", 0);
        
        tables.add(0, newTable);
        return "Upload successful";
    }

    public List<Map<String, Object>> getTables() {
        return tables;
    }

    public String cleanData(Map<String, Object> config) {
        log.info("Cleaning data with config: {}", config);
        // 模拟清洗过程
        return "Data cleaning started";
    }

    public String saveMetrics(List<Map<String, Object>> newMetrics) {
        log.info("Saving metrics: {}", newMetrics);
        this.metrics.clear();
        this.metrics.addAll(newMetrics);
        return "Metrics saved";
    }
}
