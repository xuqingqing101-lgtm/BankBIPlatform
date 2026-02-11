package com.bank.bi.controller;

import com.bank.bi.model.entity.data.DataTable;
import com.bank.bi.service.DataManagementService;
import com.bank.bi.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/data")
@RequiredArgsConstructor
public class DataManagementController {

    private final DataManagementService dataManagementService;

    /**
     * 上传 CSV 数据文件
     */
    @PostMapping("/upload")
    public ResponseUtil.Result<DataTable> uploadData(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tableName") String tableName,
            HttpServletRequest request) {
        if (file.isEmpty()) {
            return ResponseUtil.error("文件不能为空");
        }
        try {
            Long userId = getUserId(request);
            // 兼容旧接口，仍然保留自动上传
            return ResponseUtil.success(dataManagementService.uploadData(file, tableName, userId));
        } catch (Exception e) {
            log.error("上传失败", e);
            return ResponseUtil.error("上传失败: " + e.getMessage());
        }
    }

    /**
     * 步骤1：预览数据（不入库）
     */
    @PostMapping("/preview")
    public ResponseUtil.Result<java.util.Map<String, Object>> previewData(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseUtil.error("文件不能为空");
        }
        try {
            return ResponseUtil.success(dataManagementService.previewCsv(file));
        } catch (Exception e) {
            log.error("预览失败", e);
            return ResponseUtil.error("预览失败: " + e.getMessage());
        }
    }

    /**
     * 步骤2：确认并入库
     */
    @PostMapping("/confirm")
    public ResponseUtil.Result<DataTable> confirmData(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tableName") String tableName,
            @RequestParam("schema") String schemaJson,
            HttpServletRequest request) {
        if (file.isEmpty()) {
            return ResponseUtil.error("文件不能为空");
        }
        try {
            Long userId = getUserId(request);
            return ResponseUtil.success(dataManagementService.confirmImport(file, tableName, schemaJson, userId));
        } catch (Exception e) {
            log.error("导入失败", e);
            return ResponseUtil.error("导入失败: " + e.getMessage());
        }
    }

    /**
     * 获取用户已上传的数据表
     */
    @GetMapping("/tables")
    public ResponseUtil.Result<List<DataTable>> getTables(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseUtil.success(dataManagementService.getUserTables(userId));
    }

    private Long getUserId(HttpServletRequest request) {
        // 优先从 Header 获取 (模拟前端传参)
        String headerId = request.getHeader("X-User-Id");
        if (headerId != null) {
            try {
                return Long.parseLong(headerId);
            } catch (NumberFormatException e) {
                // ignore
            }
        }
        // 默认用户ID (为了测试方便)
        return 1L;
    }
}
