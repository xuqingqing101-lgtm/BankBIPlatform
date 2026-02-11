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
     * 预览 CSV 文件（不入库）
     * 返回 Schema 和前 10 行数据
     */
    public Map<String, Object> previewCsv(MultipartFile file) throws Exception {
        // 1. 读取 CSV (自动检测编码)
        java.nio.charset.Charset charset = StandardCharsets.UTF_8;
        // 实际生产中应使用 detectCharset(file) 但 MultipartFile 转 File 较麻烦，暂默认 UTF-8
        
        CsvReader reader = CsvUtil.getReader();
        CsvData data = reader.read(new BufferedReader(new InputStreamReader(file.getInputStream(), charset)));
        List<CsvRow> rows = data.getRows();

        if (rows.isEmpty()) {
            throw new RuntimeException("文件为空");
        }

        // 2. 解析表头
        List<String> headers = data.getHeader();
        if (headers == null || headers.isEmpty()) {
            headers = rows.get(0).getRawList();
            rows = rows.subList(1, rows.size());
        }
        
        // 3. 推断类型 & 建议角色
        List<Map<String, String>> schema = new ArrayList<>();
        int colCount = headers.size();
        
        // 采样
        int sampleLimit = Math.min(rows.size(), 100);
        for (int i = 0; i < colCount; i++) {
            String header = headers.get(i);
            String type = "VARCHAR";
            String role = "DIMENSION";
            boolean isNum = true;
            boolean isDate = true;
            
            for (int r = 0; r < sampleLimit; r++) {
                if (rows.get(r).getRawList().size() <= i) continue;
                String val = rows.get(r).getRawList().get(i).trim();
                if (val.isEmpty()) continue;
                
                if (!val.matches("^-?\\d*\\.?\\d+$")) isNum = false;
                if (!val.matches("^\\d{4}-\\d{2}-\\d{2}$")) isDate = false;
            }
            
            if (isNum) {
                type = "DOUBLE"; // 简化为 Double
                role = "METRIC"; // 数值型默认为指标
            } else if (isDate) {
                type = "DATE";
                role = "TIME";
            }
            
            // 修正 ID 类字段为维度
            if (header.toLowerCase().endsWith("id") || header.toLowerCase().endsWith("code")) {
                role = "DIMENSION";
            }
            
            schema.add(Map.of(
                "name", header,
                "type", type,
                "role", role,
                "displayName", header // 默认显示名
            ));
        }
        
        // 4. 获取前 10 行数据
        List<List<String>> previewData = new ArrayList<>();
        for (int i = 0; i < Math.min(rows.size(), 10); i++) {
            previewData.add(rows.get(i).getRawList());
        }
        
        return Map.of(
            "schema", schema,
            "preview", previewData,
            "totalRows", rows.size()
        );
    }

    /**
     * 确认并导入数据
     */
    @Transactional
    public DataTable confirmImport(MultipartFile file, String tableName, String schemaJson, Long userId) throws Exception {
        // schemaJson: List of {name, type, role, displayName, isSensitive}
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        List<Map<String, Object>> schema = mapper.readValue(schemaJson, new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>(){});
        
        // 1. 读取文件
        CsvReader reader = CsvUtil.getReader();
        CsvData data = reader.read(new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)));
        List<CsvRow> rows = data.getRows();
        
        // Header 处理 (略过第一行如果它是header)
        List<String> headers = data.getHeader();
        if (headers == null || headers.isEmpty()) {
            rows = rows.subList(1, rows.size());
        }

        // 2. 建表
        String physicalTableName = "user_data_" + IdUtil.simpleUUID();
        StringBuilder createSql = new StringBuilder("CREATE TABLE " + physicalTableName + " (id IDENTITY PRIMARY KEY, ");
        List<DataColumn> columns = new ArrayList<>();
        
        for (Map<String, Object> colDef : schema) {
            String colName = (String) colDef.get("name");
            String type = (String) colDef.get("type");
            String safeName = sanitizeColumnName(colName);
            
            String dbType = "VARCHAR(1000)";
            if ("INT".equals(type)) dbType = "INT";
            else if ("DOUBLE".equals(type)) dbType = "DOUBLE";
            else if ("DATE".equals(type)) dbType = "DATE";
            
            createSql.append(safeName).append(" ").append(dbType).append(", ");
            
            columns.add(DataColumn.builder()
                    .columnName(safeName)
                    .displayName((String) colDef.get("displayName"))
                    .dataType(type)
                    .columnRole((String) colDef.get("role"))
                    .isSensitive((Boolean) colDef.get("isSensitive"))
                    .build());
        }
        createSql.setLength(createSql.length() - 2);
        createSql.append(")");
        jdbcTemplate.execute(createSql.toString());
        
        // 3. 插入数据
        String insertSql = "INSERT INTO " + physicalTableName + " (" + 
                columns.stream().map(DataColumn::getColumnName).collect(Collectors.joining(", ")) + 
                ") VALUES (" + 
                columns.stream().map(c -> "?").collect(Collectors.joining(", ")) + ")";
                
        List<Object[]> batchArgs = new ArrayList<>();
        for (CsvRow row : rows) {
            List<String> rowData = row.getRawList();
            if (rowData.size() >= columns.size()) { // 允许 row 比 schema 长 (忽略多余列)
                Object[] args = new Object[columns.size()];
                for (int i = 0; i < columns.size(); i++) {
                    String val = rowData.get(i);
                    if (val == null || val.trim().isEmpty()) {
                        args[i] = null;
                    } else {
                        args[i] = val.trim().replaceAll("^\"|\"$", "");
                    }
                }
                batchArgs.add(args);
            }
        }
        jdbcTemplate.batchUpdate(insertSql, batchArgs);
        
        // 4. 保存元数据
        DataTable dataTable = DataTable.builder()
                .tableName(physicalTableName)
                .displayName(tableName)
                .rowCount((long) rows.size())
                .createdTime(LocalDateTime.now())
                .userId(userId)
                .build();
        
        DataTable savedTable = dataTableRepository.save(dataTable);
        for (DataColumn col : columns) {
            col.setDataTable(savedTable);
            dataColumnRepository.save(col);
        }
        
        return savedTable;
    }

    /**
     * 上传并处理数据文件 (File)
     */
    @Transactional
    public DataTable uploadData(java.io.File file, String tableName, Long userId) throws Exception {
        // 1. 读取 CSV (自动检测编码)
        java.nio.charset.Charset charset = detectCharset(file);
        CsvReader reader = CsvUtil.getReader();
        CsvData data = reader.read(FileUtil.getReader(file, charset));
        return processCsvData(data, tableName, userId);
    }

    /**
     * 上传并处理数据文件 (MultipartFile)
     */
    @Transactional
    public DataTable uploadData(MultipartFile file, String tableName, Long userId) throws Exception {
        // 1. 读取 CSV (自动检测编码)
        // MultipartFile 需要先转为 File 或者读取流来检测，为了简化，这里先尝试 UTF-8，如果乱码则尝试 GBK
        // 更好的方式是使用 Tika 或其他库检测流编码，但为了不引入新依赖，这里采用简单的策略：
        // 如果文件以 UTF-8 BOM 开头，或者符合 UTF-8 规则，则使用 UTF-8，否则尝试 GBK
        
        // 暂时简单处理：优先 UTF-8
        java.nio.charset.Charset charset = StandardCharsets.UTF_8;
        // 如果能检测到 GBK 特征... (这里简化处理，假设 MultipartFile 也是 UTF-8，实际生产建议先落盘再检测)
        
        CsvReader reader = CsvUtil.getReader();
        CsvData data = reader.read(new BufferedReader(new InputStreamReader(file.getInputStream(), charset)));
        return processCsvData(data, tableName, userId);
    }

    private java.nio.charset.Charset detectCharset(java.io.File file) {
        // 简单检测策略：尝试读取前几行，如果 UTF-8 解码无乱码则 UTF-8，否则 GBK
        // 也可以引入 com.googlecode.juniversalchardet
        try (java.io.BufferedInputStream bis = FileUtil.getInputStream(file)) {
            // 这里使用 Hutool 的 CharsetDetector 或者简单的逻辑
            // 为了稳健，默认为 UTF-8，如果是 Windows 中文环境常见的 GBK，可以尝试
            // 由于不能引入新依赖，我们先默认 UTF-8。如果用户反馈乱码，可以改为配置项。
            // 但考虑到 "避免乱码" 的强需求，我们加入一个简单的探测逻辑
            
            byte[] buffer = new byte[4096];
            int len = bis.read(buffer);
            if (len == -1) return StandardCharsets.UTF_8;
            
            if (isUtf8(buffer, len)) {
                return StandardCharsets.UTF_8;
            } else {
                return java.nio.charset.Charset.forName("GBK");
            }
        } catch (Exception e) {
            log.warn("编码检测失败，默认使用 UTF-8", e);
            return StandardCharsets.UTF_8;
        }
    }

    private boolean isUtf8(byte[] raw, int len) {
        int i = 0;
        while (i < len) {
            byte b = raw[i];
            if (b >= 0) {
                i++;
                continue;
            }
            int nBytes = 0;
            if ((b & 0xE0) == 0xC0) nBytes = 2;
            else if ((b & 0xF0) == 0xE0) nBytes = 3;
            else if ((b & 0xF8) == 0xF0) nBytes = 4;
            else return false;
            
            if (i + nBytes > len) return true; // 截断了，算它是吧
            
            for (int j = 1; j < nBytes; j++) {
                if ((raw[i + j] & 0xC0) != 0x80) return false;
            }
            i += nBytes;
        }
        return true;
    }

    private String sanitizeColumnName(String name) {
        if (name == null) return "col_unknown";
        String safeName = name.trim().replaceAll("[^a-zA-Z0-9_]", "_");
        
        if (safeName.matches("^\\d.*")) {
            safeName = "col_" + safeName;
        }
        
        // Common SQL reserved words
        java.util.List<String> keywords = java.util.Arrays.asList(
            "ID", "SELECT", "DELETE", "UPDATE", "INSERT", "FROM", "WHERE", "ORDER", "GROUP", "BY", 
            "HAVING", "LIMIT", "OFFSET", "USER", "TABLE", "KEY", "VALUE", "YEAR", "MONTH", "DAY", 
            "DATE", "TIME", "TIMESTAMP", "ROW", "RANK", "CAST", "CASE", "WHEN", "THEN", "ELSE", "END",
            "FUNCTION", "PROCEDURE", "TRIGGER", "VIEW", "INDEX", "CONSTRAINT", "PRIMARY", "FOREIGN",
            "CHECK", "DEFAULT", "NULL", "TRUE", "FALSE", "BOOLEAN", "INT", "INTEGER", "DOUBLE", "FLOAT",
            "CHAR", "VARCHAR", "TEXT", "CLOB", "BLOB", "BINARY", "VARBINARY"
        );
        
        if (keywords.contains(safeName.toUpperCase())) {
            safeName = safeName + "_col";
        }
        
        return safeName;
    }

    private DataTable processCsvData(CsvData data, String tableName, Long userId) {
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
        createTableSql.append("id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, ");
        
        List<DataColumn> columns = new ArrayList<>();
        String[] finalTypes = new String[colCount];
        
        for (int i = 0; i < colCount; i++) {
            String header = headers.get(i);
            String safeColumnName = sanitizeColumnName(header);
            
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
                .userId(userId)
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
     * 获取表的所有列
     */
    public List<DataColumn> getTableColumns(Long tableId) {
        return dataColumnRepository.findByDataTableId(tableId);
    }

    /**
     * 更新列元数据
     */
    @Transactional
    public DataColumn updateColumn(Long columnId, String displayName, String role, String dataType) {
        DataColumn column = dataColumnRepository.findById(columnId)
                .orElseThrow(() -> new RuntimeException("列不存在"));
        
        if (displayName != null) column.setDisplayName(displayName);
        if (role != null) column.setColumnRole(role);
        if (dataType != null) column.setDataType(dataType);
        
        return dataColumnRepository.save(column);
    }

    /**
     * 获取用户的数据表元数据
     */
    public List<DataTable> getUserTables(Long userId) {
        if (userId == null) return getAllTables(); // Fallback for testing
        return dataTableRepository.findByUserId(userId);
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
