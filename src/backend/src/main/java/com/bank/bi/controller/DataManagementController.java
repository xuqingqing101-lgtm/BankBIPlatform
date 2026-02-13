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
     * 导入Schema
     */
    @PostMapping("/schema/import")
    public ResponseUtil.Result<List<String>> importSchema(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "domain", required = false) String domain,
            HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            return ResponseUtil.success(dataManagementService.importSchema(file, userId, domain));
        } catch (Exception e) {
            log.error("Schema导入失败", e);
            return ResponseUtil.error("Schema导入失败: " + e.getMessage());
        }
    }

    /**
     * 导入数据
     */
    @PostMapping("/import")
    public ResponseUtil.Result<String> importData(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "mode", defaultValue = "append") String mode,
            HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            return ResponseUtil.success(dataManagementService.importData(file, mode, userId));
        } catch (Exception e) {
            log.error("数据导入失败", e);
            return ResponseUtil.error("数据导入失败: " + e.getMessage());
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

    /**
     * 获取表的列信息
     */
    @GetMapping("/tables/{tableId}/columns")
    public ResponseUtil.Result<List<com.bank.bi.model.entity.data.DataColumn>> getTableColumns(@PathVariable Long tableId) {
        return ResponseUtil.success(dataManagementService.getTableColumns(tableId));
    }

    /**
     * 更新列信息
     */
    @PutMapping("/columns/{columnId}")
    public ResponseUtil.Result<com.bank.bi.model.entity.data.DataColumn> updateColumn(
            @PathVariable Long columnId,
            @RequestBody java.util.Map<String, String> body) {
        return ResponseUtil.success(dataManagementService.updateColumn(
                columnId,
                body.get("displayName"),
                body.get("role"),
                body.get("dataType")
        ));
    }
    
    /**
     * 触发数据清洗 (模拟)
     */
    @PostMapping("/clean/{tableId}")
    public ResponseUtil.Result<String> cleanTable(@PathVariable Long tableId) {
        // 实际逻辑中可能会调用异步任务清洗数据
        try {
            Thread.sleep(1000); // 模拟耗时
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return ResponseUtil.success("清洗任务已提交并自动完成");
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
