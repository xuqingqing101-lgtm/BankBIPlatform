package com.bank.bi.controller;

import com.bank.bi.util.ResponseUtil;
import com.bank.bi.service.DataManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/data")
@RequiredArgsConstructor
public class DataManagementController {

    private final DataManagementService dataService;

    @PostMapping("/upload")
    public ResponseUtil.Result<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseUtil.success(dataService.uploadFile(file));
        } catch (Exception e) {
            log.error("File upload failed", e);
            return ResponseUtil.error("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/tables")
    public ResponseUtil.Result<List<Map<String, Object>>> getTables() {
        return ResponseUtil.success(dataService.getTables());
    }

    @PostMapping("/clean")
    public ResponseUtil.Result<String> cleanData(@RequestBody Map<String, Object> config) {
        return ResponseUtil.success(dataService.cleanData(config));
    }

    @PostMapping("/metrics")
    public ResponseUtil.Result<String> saveMetrics(@RequestBody List<Map<String, Object>> metrics) {
        return ResponseUtil.success(dataService.saveMetrics(metrics));
    }
}
