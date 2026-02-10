package com.bank.bi.service;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.text.csv.CsvData;
import cn.hutool.core.text.csv.CsvReader;
import cn.hutool.core.text.csv.CsvRow;
import cn.hutool.core.text.csv.CsvUtil;
import cn.hutool.core.util.IdUtil;
import com.bank.bi.model.entity.data.DataColumn;
import com.bank.bi.model.entity.data.DataTable;
import com.bank.bi.repository.data.DataColumnRepository;
import com.bank.bi.repository.data.DataTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataManagementService {

    private final DataTableRepository dataTableRepository;
    private final DataColumnRepository dataColumnRepository;
    private final JdbcTemplate jdbcTemplate;

    /**
     * 上传并处理数据文件 (CSV)
     */
    @Transactional
    public DataTable uploadData(MultipartFile file, String tableName) throws Exception {
        // 1. 读取 CSV
        CsvReader reader = CsvUtil.getReader();
        CsvData data = reader.read(new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)));
        List<CsvRow> rows = data.getRows();

        if (rows.isEmpty()) {
            throw new RuntimeException("文件为空");
        }

        // 2. 解析表头
        List<String> headers = data.getHeader();
        if (headers == null || headers.isEmpty()) {
            // 如果 Hutool 没自动解析 header，尝试取第一行
            headers = rows.get(0).getRawList();
            rows = rows.subList(1, rows.size());
        }
        
        // 3. 推断数据类型
        int colCount = headers.size();
        boolean[] isInt = new boolean[colCount];
        boolean[] isDouble = new boolean[colCount];
        boolean[] isDate = new boolean[colCount];
        
        // 初始化标记
        for(int i=0; i<colCount; i++) {
            isInt[i] = true;
            isDouble[i] = true;
            isDate[i] = true;
        }

        // 采样前 1000 行进行类型推断
        int sampleLimit = Math.min(rows.size(), 1000);
        for (int i = 0; i < sampleLimit; i++) {
            List<String> rowData = rows.get(i).getRawList();
            for (int j = 0; j < colCount && j < rowData.size(); j++) {
                String val = rowData.get(j);
                if (val == null || val.trim().isEmpty()) continue;
                
                // 移除可能的引号和空格
                val = val.trim().replaceAll("^\"|\"$", "");
                
                if (isInt[j] && !val.matches("^-?\\d+$")) isInt[j] = false;
                if (isDouble[j] && !val.matches("^-?\\d*\\.?\\d+$")) isDouble[j] = false;
                // 简单日期匹配 YYYY-MM-DD
                if (isDate[j] && !val.matches("^\\d{4}-\\d{2}-\\d{2}$")) isDate[j] = false;
            }
        }
        
        // 4. 生成物理表名
        String physicalTableName = "user_data_" + IdUtil.simpleUUID();

        // 5. 创建物理表 (H2 Database)
        StringBuilder createTableSql = new StringBuilder("CREATE TABLE " + physicalTableName + " (");
        createTableSql.append("id IDENTITY PRIMARY KEY, ");
        
        List<DataColumn> columns = new ArrayList<>();
        String[] finalTypes = new String[colCount];
        
        for (int i = 0; i < colCount; i++) {
            String header = headers.get(i);
            String safeColumnName = header.replaceAll("[^a-zA-Z0-9_]", "_");
            if (safeColumnName.matches("^\\d.*")) {
                safeColumnName = "col_" + safeColumnName;
            }
            
            // 确定最终类型
            String dataType = "VARCHAR(1000)";
            if (isInt[i]) dataType = "INT";
            else if (isDouble[i]) dataType = "DOUBLE";
            else if (isDate[i]) dataType = "DATE";
            
            finalTypes[i] = dataType;
            createTableSql.append(safeColumnName).append(" ").append(dataType).append(", ");
            
            columns.add(DataColumn.builder()
                    .columnName(safeColumnName)
                    .displayName(header)
                    .dataType(dataType.split("\\(")[0]) // 存入元数据时不带长度
                    .build());
        }
        
        createTableSql.setLength(createTableSql.length() - 2); // 去掉最后的逗号
        createTableSql.append(")");
        
        log.info("执行建表语句: {}", createTableSql);
        jdbcTemplate.execute(createTableSql.toString());

        // 6. 插入数据
        String insertSql = "INSERT INTO " + physicalTableName + " (" + 
                columns.stream().map(DataColumn::getColumnName).collect(Collectors.joining(", ")) + 
                ") VALUES (" + 
                columns.stream().map(c -> "?").collect(Collectors.joining(", ")) + 
                ")";
        
        List<Object[]> batchArgs = new ArrayList<>();
        for (CsvRow row : rows) {
            List<String> rowData = row.getRawList();
            if (rowData.size() == columns.size()) {
                // 处理空值转换
                Object[] args = new Object[colCount];
                for (int j = 0; j < colCount; j++) {
                    String val = rowData.get(j);
                    if (val == null || val.trim().isEmpty()) {
                        args[j] = null;
                    } else {
                        args[j] = val.trim().replaceAll("^\"|\"$", "");
                    }
                }
                batchArgs.add(args);
            }
        }
        
        jdbcTemplate.batchUpdate(insertSql, batchArgs);

        // 7. 保存元数据
        DataTable dataTable = DataTable.builder()
                .tableName(physicalTableName)
                .displayName(tableName)
                .rowCount((long) rows.size())
                .createdTime(LocalDateTime.now())
                .build();
        
        DataTable savedTable = dataTableRepository.save(dataTable);
        
        for (DataColumn column : columns) {
            column.setDataTable(savedTable);
            dataColumnRepository.save(column);
        }
        
        // 重新加载带 ID 的 columns
        savedTable.setColumns(columns);
        
        return savedTable;
    }

    /**
     * 获取所有数据表元数据
     */
    public List<DataTable> getAllTables() {
        return dataTableRepository.findAll();
    }
    
    /**
     * 执行查询 SQL
     */
    public List<Map<String, Object>> executeQuery(String sql) {
        // 安全检查：简单防止非 SELECT 语句
        String trimmedSql = sql.trim().toUpperCase();
        if (!trimmedSql.startsWith("SELECT") && !trimmedSql.startsWith("WITH")) {
            throw new RuntimeException("仅支持 SELECT 查询语句");
        }
        
        // 限制返回行数，防止爆内存
        if (!trimmedSql.contains("LIMIT")) {
            sql += " LIMIT 100";
        }
        
        return jdbcTemplate.queryForList(sql);
    }
}
