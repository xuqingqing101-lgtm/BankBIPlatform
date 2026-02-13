package com.bank.bi.service;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.text.csv.CsvData;
import cn.hutool.core.text.csv.CsvReader;
import cn.hutool.core.text.csv.CsvRow;
import cn.hutool.core.text.csv.CsvUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;
import com.bank.bi.model.entity.data.DataColumn;
import com.bank.bi.model.entity.data.DataTable;
import com.bank.bi.repository.data.DataColumnRepository;
import com.bank.bi.repository.data.DataTableRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataManagementService {

    private final DataTableRepository dataTableRepository;
    private final DataColumnRepository dataColumnRepository;
    private final JdbcTemplate jdbcTemplate;

    /**
     * 导入表结构
     */
    @Transactional
    public List<String> importSchema(MultipartFile file, Long userId, String domain) throws Exception {
        List<SchemaDefinition> definitions = parseSchemaFile(file);
        List<String> logs = new ArrayList<>();

        // 按表名分组
        Map<String, List<SchemaDefinition>> tableGroups = definitions.stream()
                .collect(Collectors.groupingBy(SchemaDefinition::getTableNameEn));

        for (Map.Entry<String, List<SchemaDefinition>> entry : tableGroups.entrySet()) {
            String tableNameEn = entry.getKey();
            List<SchemaDefinition> columns = entry.getValue();
            String tableNameCn = columns.get(0).getTableNameCn();

            // 检查表是否存在
            Optional<DataTable> tableOpt = dataTableRepository.findByTableName(tableNameEn);
            
            if (tableOpt.isEmpty()) {
                // 新建表
                createTable(tableNameEn, tableNameCn, columns, userId, domain);
                logs.add("创建表: " + tableNameEn + " (" + tableNameCn + ") - 领域: " + domain);
            } else {
                // 修改表
                alterTable(tableOpt.get(), columns, logs);
                // 更新领域信息 (如果提供了)
                if (domain != null && !domain.isEmpty()) {
                    DataTable table = tableOpt.get();
                    table.setDomain(domain);
                    dataTableRepository.save(table);
                }
            }
        }
        return logs;
    }

    /**
     * 导入数据
     */
    @Transactional
    public String importData(MultipartFile file, String mode, Long userId) throws Exception {
        String fileName = file.getOriginalFilename();
        String tableNameEn = fileName.substring(0, fileName.lastIndexOf('.'));
        
        Optional<DataTable> tableOpt = dataTableRepository.findByTableName(tableNameEn);
        if (tableOpt.isEmpty()) {
            throw new RuntimeException("表 " + tableNameEn + " 不存在，请先上传表结构定义。");
        }
        DataTable dataTable = tableOpt.get();

        // 解析数据文件
        List<Map<String, Object>> dataList = parseDataFile(file);
        if (dataList.isEmpty()) return "文件为空";

        // 校验列
        List<DataColumn> dbColumns = dataColumnRepository.findByDataTableId(dataTable.getId());
        Set<String> dbColNames = dbColumns.stream().map(DataColumn::getColumnName).collect(Collectors.toSet());
        
        // 取第一行数据的key作为表头
        Set<String> fileHeaders = dataList.get(0).keySet();
        for (String header : fileHeaders) {
            if (!dbColNames.contains(header)) {
                // 忽略未知列，或者抛出异常
                // log.warn("文件包含未知列: {}", header);
            }
        }

        // 覆盖模式：清空表
        if ("overwrite".equalsIgnoreCase(mode)) {
            jdbcTemplate.execute("TRUNCATE TABLE " + tableNameEn);
        }

        // 插入数据
        if (!dataList.isEmpty()) {
            String insertSql = buildInsertSql(tableNameEn, fileHeaders);
            List<Object[]> batchArgs = new ArrayList<>();
            
            for (Map<String, Object> row : dataList) {
                Object[] args = new Object[fileHeaders.size()];
                int i = 0;
                for (String header : fileHeaders) {
                    Object val = row.get(header);
                    // 处理空字符串为null
                    if (val instanceof String && ((String) val).trim().isEmpty()) {
                        val = null;
                    }
                    args[i++] = val;
                }
                batchArgs.add(args);
            }
            
            jdbcTemplate.batchUpdate(insertSql, batchArgs);
            
            // 更新行数
            Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tableNameEn, Long.class);
            dataTable.setRowCount(count);
            dataTableRepository.save(dataTable);
        }

        return "成功导入 " + dataList.size() + " 条数据到表 " + tableNameEn;
    }

    private void createTable(String tableName, String displayName, List<SchemaDefinition> columns, Long userId, String domain) {
        StringBuilder sql = new StringBuilder("CREATE TABLE ").append(tableName).append(" (");
        sql.append("id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, ");
        
        for (SchemaDefinition col : columns) {
            sql.append(col.getColumnNameEn()).append(" ").append(mapDataType(col.getDataType(), col.getLength())).append(", ");
        }
        
        sql.setLength(sql.length() - 2);
        sql.append(")");
        
        jdbcTemplate.execute(sql.toString());
        
        // 保存元数据
        DataTable table = DataTable.builder()
                .tableName(tableName)
                .displayName(displayName)
                .rowCount(0L)
                .createdTime(LocalDateTime.now())
                .userId(userId)
                .domain(domain)
                .build();
        table = dataTableRepository.save(table);
        
        for (SchemaDefinition col : columns) {
            DataColumn dc = DataColumn.builder()
                    .columnName(col.getColumnNameEn())
                    .displayName(col.getColumnNameCn())
                    .dataType(col.getDataType())
                    .columnRole(guessRole(col.getDataType()))
                    .dataTable(table)
                    .build();
            dataColumnRepository.save(dc);
        }
    }

    private void alterTable(DataTable table, List<SchemaDefinition> columns, List<String> logs) {
        for (SchemaDefinition col : columns) {
            String op = col.getOpType();
            String colName = col.getColumnNameEn();
            
            if ("新增".equals(op) || "add".equalsIgnoreCase(op)) {
                // ALTER TABLE tbl ADD COLUMN col type
                try {
                    String sql = "ALTER TABLE " + table.getTableName() + " ADD COLUMN " + colName + " " + mapDataType(col.getDataType(), col.getLength());
                    jdbcTemplate.execute(sql);
                    
                    DataColumn dc = DataColumn.builder()
                            .columnName(colName)
                            .displayName(col.getColumnNameCn())
                            .dataType(col.getDataType())
                            .columnRole(guessRole(col.getDataType()))
                            .dataTable(table)
                            .build();
                    dataColumnRepository.save(dc);
                    logs.add("新增列: " + colName);
                } catch (Exception e) {
                    logs.add("新增列失败 " + colName + ": " + e.getMessage());
                }
            } else if ("修改".equals(op) || "modify".equalsIgnoreCase(op)) {
                try {
                    String sql = "ALTER TABLE " + table.getTableName() + " ALTER COLUMN " + colName + " " + mapDataType(col.getDataType(), col.getLength());
                    jdbcTemplate.execute(sql);
                    
                    Optional<DataColumn> dcOpt = dataColumnRepository.findByDataTableIdAndColumnName(table.getId(), colName);
                    if (dcOpt.isPresent()) {
                        DataColumn dc = dcOpt.get();
                        dc.setDisplayName(col.getColumnNameCn());
                        dc.setDataType(col.getDataType());
                        dataColumnRepository.save(dc);
                    }
                    logs.add("修改列: " + colName);
                } catch (Exception e) {
                    logs.add("修改列失败 " + colName + ": " + e.getMessage());
                }
            } else if ("删除".equals(op) || "delete".equalsIgnoreCase(op)) {
                try {
                    String sql = "ALTER TABLE " + table.getTableName() + " DROP COLUMN " + colName;
                    jdbcTemplate.execute(sql);
                    dataColumnRepository.deleteByDataTableIdAndColumnName(table.getId(), colName);
                    logs.add("删除列: " + colName);
                } catch (Exception e) {
                    logs.add("删除列失败 " + colName + ": " + e.getMessage());
                }
            }
        }
    }

    private List<SchemaDefinition> parseSchemaFile(MultipartFile file) throws Exception {
        List<SchemaDefinition> list = new ArrayList<>();
        String filename = file.getOriginalFilename();
        
        List<Map<String, Object>> rows = parseDataFile(file); // Reuse parsing logic
        
        for (Map<String, Object> row : rows) {
            // Mapping keys might be chinese or english depending on excel header
            // Try both or standardize
            String tableEn = getString(row, "数据表英文名", "table_name_en");
            if (tableEn == null) continue; // Skip empty rows
            
            list.add(SchemaDefinition.builder()
                    .tableNameEn(tableEn)
                    .tableNameCn(getString(row, "数据表中文名", "table_name_cn"))
                    .columnNameEn(getString(row, "字段英文名", "col_name_en"))
                    .columnNameCn(getString(row, "字段中文名", "col_name_cn"))
                    .dataType(getString(row, "数据类型", "data_type"))
                    .length(getInteger(row, "字段长度", "length"))
                    .isSensitive(getString(row, "是否敏感信息", "is_sensitive"))
                    .opType(getString(row, "操作类型", "op_type")) // Updated field name
                    .build());
        }
        return list;
    }

    private List<Map<String, Object>> parseDataFile(MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename();
        if (filename != null && (filename.endsWith(".xlsx") || filename.endsWith(".xls"))) {
            ExcelReader reader = ExcelUtil.getReader(file.getInputStream());
            return reader.readAll();
        } else {
            // CSV
            CsvReader reader = CsvUtil.getReader();
            CsvData data = reader.read(new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)));
            List<String> headers = data.getHeader();
            if (headers == null && !data.getRows().isEmpty()) {
                headers = data.getRows().get(0).getRawList();
            }
            List<Map<String, Object>> result = new ArrayList<>();
            if (headers != null) {
                List<CsvRow> rows = data.getRows();
                // If header was in row 0, skip it
                int start = 0;
                if (!rows.isEmpty() && rows.get(0).getRawList().equals(headers)) {
                    start = 1;
                }
                for (int i = start; i < rows.size(); i++) {
                    CsvRow row = rows.get(i);
                    Map<String, Object> map = new HashMap<>();
                    for (int j = 0; j < headers.size() && j < row.size(); j++) {
                        map.put(headers.get(j), row.get(j));
                    }
                    result.add(map);
                }
            }
            return result;
        }
    }

    private String getString(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            if (map.containsKey(key)) return map.get(key).toString();
        }
        return null;
    }

    private Integer getInteger(Map<String, Object> map, String... keys) {
        String val = getString(map, keys);
        if (val == null) return null;
        try {
            if (val.contains(".")) return (int) Double.parseDouble(val);
            return Integer.parseInt(val);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String mapDataType(String type, Integer length) {
        type = type.toUpperCase();
        if ("VARCHAR".equals(type) || "STRING".equals(type)) {
            return "VARCHAR(" + (length != null ? length : 255) + ")";
        }
        if ("INT".equals(type) || "INTEGER".equals(type)) return "INT";
        if ("DOUBLE".equals(type) || "FLOAT".equals(type) || "DECIMAL".equals(type)) return "DOUBLE";
        if ("DATE".equals(type)) return "DATE";
        if ("DATETIME".equals(type)) return "TIMESTAMP";
        return "VARCHAR(255)";
    }

    private String guessRole(String type) {
        if ("INT".equalsIgnoreCase(type) || "DOUBLE".equalsIgnoreCase(type)) return "METRIC";
        if ("DATE".equalsIgnoreCase(type) || "DATETIME".equalsIgnoreCase(type)) return "TIME";
        return "DIMENSION";
    }

    private String buildInsertSql(String tableName, Set<String> headers) {
        StringBuilder sb = new StringBuilder("INSERT INTO ").append(tableName).append(" (");
        for (String header : headers) sb.append(header).append(",");
        sb.setLength(sb.length() - 1);
        sb.append(") VALUES (");
        for (int i = 0; i < headers.size(); i++) sb.append("?,");
        sb.setLength(sb.length() - 1);
        sb.append(")");
        return sb.toString();
    }

    @Data
    @Builder
    public static class SchemaDefinition {
        private String tableNameEn;
        private String tableNameCn;
        private String columnNameEn;
        private String columnNameCn;
        private String dataType;
        private Integer length;
        private String isSensitive;
        private String opType;
    }
    
    public List<Map<String, Object>> executeQuery(String sql) {
        return jdbcTemplate.queryForList(sql);
    }

    public List<String> importSchema(MultipartFile file, Long userId) throws Exception {
        return importSchema(file, userId, null);
    }

    public List<DataTable> getUserTables(Long userId) {
        return dataTableRepository.findAll();
    }

    public List<DataTable> getUserTablesByDomain(Long userId, String domain) {
        if (domain == null || domain.isEmpty() || "dashboard".equalsIgnoreCase(domain)) {
            return dataTableRepository.findAll();
        }
        return dataTableRepository.findAll().stream()
                .filter(t -> domain.equalsIgnoreCase(t.getDomain()))
                .collect(Collectors.toList());
    }

    public List<DataColumn> getTableColumns(Long tableId) {
        return dataColumnRepository.findByDataTableId(tableId);
    }

    @Transactional
    public DataColumn updateColumn(Long columnId, String displayName, String role, String dataType) {
        Optional<DataColumn> colOpt = dataColumnRepository.findById(columnId);
        if (colOpt.isPresent()) {
            DataColumn col = colOpt.get();
            if (displayName != null) col.setDisplayName(displayName);
            if (role != null) col.setColumnRole(role);
            if (dataType != null) col.setDataType(dataType);
            return dataColumnRepository.save(col);
        }
        throw new RuntimeException("列不存在: " + columnId);
    }

    // Placeholder for backward compatibility if needed, though mostly unused now
    public DataTable uploadData(MultipartFile file, MultipartFile schemaFile, String tableName, Long userId) {
        return null;
    }
}

