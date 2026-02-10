package com.bank.bi.controller;

import com.bank.bi.model.entity.data.DataTable;
import com.bank.bi.service.DataManagementService;
import com.bank.bi.util.ResponseUtil;
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
            @RequestParam(value = "tableName", required = false) String tableName) {
        
        try {
            if (file.isEmpty()) {
                return ResponseUtil.error("请选择文件");
            }
            
            String name = tableName != null ? tableName : file.getOriginalFilename();
            DataTable table = dataManagementService.uploadData(file, name);
            
            return ResponseUtil.success(table);
            
        } catch (Exception e) {
            log.error("数据上传失败", e);
            return ResponseUtil.error("上传失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取所有已上传的数据表
     */
    @GetMapping("/tables")
    public ResponseUtil.Result<List<DataTable>> getTables() {
        return ResponseUtil.success(dataManagementService.getAllTables());
    }
}
