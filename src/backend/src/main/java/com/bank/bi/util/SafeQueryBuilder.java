package com.bank.bi.util;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 安全的 JSON to SQL 构建器
 * 对应 PRD 5.2.1 和 5.2.2 安全控制机制
 */
@Slf4j
@Component
public class SafeQueryBuilder {

    @Data
    public static class QueryRequest {
        @JsonProperty("table")
        private String table;
        
        @JsonProperty("columns")
        private List<String> columns; // ["col1", "col2"] or ["*"] or ["SUM(amount) as total"]
        
        @JsonProperty("filters")
        private List<Filter> filters;
        
        @JsonProperty("groupBy")
        private List<String> groupBy;
        
        @JsonProperty("orderBy")
        private List<String> orderBy; // ["col1 DESC", "col2 ASC"]
        
        @JsonProperty("limit")
        private Integer limit;
    }

    @Data
    public static class Filter {
        @JsonProperty("column")
        private String column;
        
        @JsonProperty("operator")
        private String operator; // =, !=, >, <, >=, <=, LIKE, IN
        
        @JsonProperty("value")
        private Object value;
    }

    /**
     * 构建安全SQL
     * @param request JSON查询对象
     * @param dataScope 用户数据权限范围 (e.g., "Beijing Branch")
     * @return 可执行SQL
     */
    public String buildSql(QueryRequest request, String dataScope) {
        // 1. 基础校验 (Whitelist validation could be added here against metadata)
        if (!isValidName(request.getTable())) {
            throw new IllegalArgumentException("Invalid table name: " + request.getTable());
        }

        StringBuilder sql = new StringBuilder("SELECT ");

        // 2. Columns
        if (request.getColumns() == null || request.getColumns().isEmpty()) {
            sql.append("*");
        } else {
            // Basic injection check for columns (allow aggregate functions)
            String cols = request.getColumns().stream()
                    .map(this::sanitizeColumn)
                    .collect(Collectors.joining(", "));
            sql.append(cols);
        }

        sql.append(" FROM ").append(request.getTable());

        // 3. Filters (Where clause)
        List<String> conditions = new ArrayList<>();
        
        // 3.1 User Defined Filters
        if (request.getFilters() != null) {
            for (Filter f : request.getFilters()) {
                if (!isValidName(f.getColumn())) continue;
                String op = f.getOperator().toUpperCase();
                if (!isValidOperator(op)) continue;
                
                String valStr = formatValue(f.getValue());
                conditions.add(f.getColumn() + " " + op + " " + valStr);
            }
        }
        
        // 3.2 Data Permission Injection (Row Level Security)
        if (StringUtils.hasText(dataScope) && !"ALL".equalsIgnoreCase(dataScope)) {
            // Assuming the table has a 'branch' or 'org' column. 
            // In a real system, we would check metadata to see which column maps to 'branch'.
            // Here we use a heuristic: if table has 'branch' column (implied context), we add filter.
            // For safety, we always add it if the business logic implies it.
            // Simplified: Add filter if table name implies branch data or strictly add:
            // (branch = 'scope' OR 1=1 if column missing - risky).
            // Better: We assume standard schema.
            
            // For the prototype, we simply add: AND branch = 'dataScope'
            // But we must handle if column doesn't exist to avoid SQL error?
            // Let's assume the LLM knows the schema or we just append it for tables that usually have it.
            // Or better: The prompt should have told LLM to include it? No, hard isolation means WE add it.
            
            // Let's assume all our business tables (deposit, loan) have 'branch' column for now.
            conditions.add("branch = '" + dataScope + "'");
        }

        if (!conditions.isEmpty()) {
            sql.append(" WHERE ").append(String.join(" AND ", conditions));
        }

        // 4. Group By
        if (request.getGroupBy() != null && !request.getGroupBy().isEmpty()) {
            String groups = request.getGroupBy().stream()
                    .filter(this::isValidName)
                    .collect(Collectors.joining(", "));
            if (!groups.isEmpty()) {
                sql.append(" GROUP BY ").append(groups);
            }
        }

        // 5. Order By
        if (request.getOrderBy() != null && !request.getOrderBy().isEmpty()) {
             String orders = request.getOrderBy().stream()
                    .filter(s -> s.matches("^[a-zA-Z0-9_]+(\\s+(ASC|DESC))?$"))
                    .collect(Collectors.joining(", "));
             if (!orders.isEmpty()) {
                 sql.append(" ORDER BY ").append(orders);
             }
        }

        // 6. Force Limit (5.2.2 point 1)
        int limit = (request.getLimit() != null && request.getLimit() > 0) ? Math.min(request.getLimit(), 100) : 100;
        sql.append(" LIMIT ").append(limit);

        return sql.toString();
    }

    private boolean isValidName(String name) {
        if (name == null) return false;
        return name.matches("^[a-zA-Z0-9_]+$");
    }

    private String sanitizeColumn(String col) {
        // Allow alpha-numeric, underscore, and aggregate syntax like SUM(col), COUNT(*)
        if (col.matches("^[a-zA-Z0-9_]+$")) return col;
        if (col.matches("^(SUM|COUNT|AVG|MAX|MIN)\\([a-zA-Z0-9_\\*]+\\)(\\s+as\\s+[a-zA-Z0-9_]+)?$")) return col;
        return "1"; // Safe fallback
    }

    private boolean isValidOperator(String op) {
        return List.of("=", "!=", ">", "<", ">=", "<=", "LIKE", "IN").contains(op);
    }

    private String formatValue(Object val) {
        if (val == null) return "NULL";
        if (val instanceof Number) return val.toString();
        String s = val.toString();
        
        // Handle SQL Functions/Expressions without quoting (DANGER: Must be strict!)
        // e.g. CURDATE(), NOW(), DATE_SUB(...)
        String upper = s.toUpperCase().trim();
        if (upper.startsWith("CURDATE()") || upper.startsWith("NOW()") || 
            upper.startsWith("CURRENT_DATE") || upper.startsWith("CURRENT_TIMESTAMP") ||
            upper.startsWith("DATE_SUB") || upper.startsWith("DATE_ADD") ||
            (upper.contains("INTERVAL") && (upper.startsWith("CURDATE") || upper.startsWith("NOW")))) {
            
            // Basic validation to prevent arbitrary injection in "function" calls
            // Only allow specific safe chars: A-Z, 0-9, _, (, ), +, -, space
            if (s.matches("^[a-zA-Z0-9_\\(\\)\\+\\-\\s]+$")) {
                return s;
            }
        }
        
        // Basic escape for single quotes to prevent injection
        return "'" + s.replace("'", "''") + "'";
    }
    
    // Helper to fix java.util.ArrayList import issue in main method
    private static class ArrayList<E> extends java.util.ArrayList<E> {}
}
