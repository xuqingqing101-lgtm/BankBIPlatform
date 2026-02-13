package com.bank.bi.service;

import com.bank.bi.config.HiAgentConfig;
import com.bank.bi.model.dto.HiAgentRequest;
import com.bank.bi.model.dto.HiAgentResponse;
import com.bank.bi.model.entity.Conversation;
import com.bank.bi.model.entity.Message;
import com.bank.bi.model.entity.data.DataColumn;
import com.bank.bi.model.entity.data.DataTable;
import com.bank.bi.repository.ConversationRepository;
import com.bank.bi.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.bank.bi.model.entity.AuditLog;
import com.bank.bi.model.entity.User;
import com.bank.bi.repository.AuditLogRepository;
import com.bank.bi.repository.UserRepository;
import com.bank.bi.util.DataMaskingUtil;

/**
 * HiAgent AI服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HiAgentService {
    
    private final WebClient hiAgentWebClient;
    private final HiAgentConfig hiAgentConfig;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final DataManagementService dataManagementService;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    
    /**
     * 调用HiAgent API
     */
    public HiAgentResponse chat(HiAgentRequest request) {
        try {
            log.info("调用HiAgent API, model: {}, messages: {}", 
                    request.getModel(), request.getMessages().size());
            
            HiAgentResponse response = hiAgentWebClient
                    .post()
                    .uri("/v1/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(HiAgentResponse.class)
                    .timeout(Duration.ofMillis(hiAgentConfig.getTimeout()))
                    .block();
            
            if (response != null && response.getUsage() != null) {
                log.info("HiAgent响应成功, tokens: {}", response.getUsage().getTotalTokens());
            }
            
            return response;
            
        } catch (Exception e) {
            log.error("调用HiAgent API失败", e);
            throw new RuntimeException("AI服务调用失败: " + e.getMessage());
        }
    }
    
    /**
     * 多轮对话
     */
    @Transactional
    public Message multiRoundChat(String query, String module, Long conversationId, Long userId) {
        long startTime = System.currentTimeMillis();
        
        // 1. 获取或创建对话
        Conversation conversation;
        if (conversationId != null) {
            conversation = conversationRepository.findById(conversationId)
                    .orElseThrow(() -> new RuntimeException("对话不存在"));
        } else {
            conversation = createConversation(userId, module, query);
        }
        
        // 2. 保存用户消息
        Message userMessage = Message.builder()
                .conversationId(conversation.getConversationId())
                .type("user")
                .content(query)
                .createdTime(LocalDateTime.now())
                .build();
        messageRepository.save(userMessage);
        
        // 3. 获取对话历史
        List<Message> history = messageRepository
                .findByConversationIdOrderByCreatedTimeAsc(conversation.getConversationId());
        
        // 4. 构建HiAgent请求
        List<HiAgentRequest.Message> messages = new ArrayList<>();
        
        // 系统提示词
        String systemPrompt = buildSystemPrompt(conversation.getModule());
        messages.add(HiAgentRequest.Message.builder()
                .role("system")
                .content(systemPrompt)
                .build());
        
        // 历史对话（最近10轮）
        int historySize = history.size();
        int startIndex = Math.max(0, historySize - 20);  // 最多取最近20条消息（10轮对话）
        messages.addAll(history.subList(startIndex, historySize).stream()
                .map(msg -> HiAgentRequest.Message.builder()
                        .role(msg.getType())
                        .content(msg.getContent())
                        .build())
                .collect(Collectors.toList()));
        
        HiAgentRequest request = HiAgentRequest.builder()
                .model(hiAgentConfig.getModel())
                .messages(messages)
                .temperature(hiAgentConfig.getTemperature())
                .maxTokens(hiAgentConfig.getMaxTokens())
                .stream(false)
                .build();
        
        // 5. 调用HiAgent
        HiAgentResponse response = chat(request);
        String aiResponse = response.getChoices().get(0).getMessage().getContent();
        
        // 6. 保存AI回复
        long responseTime = System.currentTimeMillis() - startTime;
        Message aiMessage = Message.builder()
                .conversationId(conversation.getConversationId())
                .type("assistant")
                .content(aiResponse)
                .queryText(query)
                .modelName(hiAgentConfig.getModel())
                .tokensUsed(response.getUsage().getTotalTokens())
                .responseTime((int) responseTime)
                .createdTime(LocalDateTime.now())
                .build();
        messageRepository.save(aiMessage);
        
        // 7. 更新对话统计
        conversation.setMessageCount(conversation.getMessageCount() + 2);
        conversationRepository.save(conversation);
        
        return aiMessage;
    }
    
    /**
     * 创建新对话
     */
    private Conversation createConversation(Long userId, String module, String firstQuery) {
        String title = firstQuery.length() > 50 
                ? firstQuery.substring(0, 50) + "..." 
                : firstQuery;
        
        Conversation conversation = Conversation.builder()
                .userId(userId)
                .sessionId(UUID.randomUUID().toString())
                .module(module != null ? module : "deposit")
                .title(title)
                .status(1)
                .messageCount(0)
                .startedTime(LocalDateTime.now())
                .build();
        
        return conversationRepository.save(conversation);
    }
    
    /**
     * 构建系统提示词
     */
    private String buildSystemPrompt(String module) {
        String basePrompt = """
            你是一位专业的银行业务AI分析助手，具备以下能力：
            1. 深入理解银行"存贷汇"三大核心业务
            2. 熟悉对公和零售两大客户体系
            3. 能够分析财务数据、业务指标和风险状况
            4. 提供专业、准确、简洁的数据分析和建议
            
            回答要求：
            - 基于数据和业务逻辑分析
            - 使用专业术语，但保持易懂
            - 重点突出，结构清晰
            - 必要时提供数据支撑和图表建议
            - 主动识别风险和机会
            """;
        
        return switch (module) {
            case "deposit" -> basePrompt + "\n\n当前聚焦：存款业务分析（余额、增长、结构、客户）";
            case "loan" -> basePrompt + "\n\n当前聚焦：贷款业务分析（余额、不良率、行业分布、风险）";
            case "intermediate" -> basePrompt + "\n\n当前聚焦：中间业务分析（收入、占比、趋势、产品）";
            case "customer" -> basePrompt + "\n\n当前聚焦：客户画像分析（分层、价值、活跃度、AUM）";
            case "dashboard" -> basePrompt + "\n\n当前聚焦：经营管理驾驶舱（KPI、趋势、预警、决策支持）";
            case "knowledge" -> basePrompt + "\n\n当前聚焦：制度流程查询（准确引用、流程说明、合规指导）";
            default -> basePrompt;
        };
    }
    
    /**
     * 获取对话历史
     */
    public List<Message> getConversationHistory(Long conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedTimeAsc(conversationId);
    }
    
    /**
     * 获取用户的所有对话
     */
    public List<Conversation> getUserConversations(Long userId) {
        return conversationRepository.findByUserIdOrderByStartedTimeDesc(userId);
    }

    /**
     * 智能数据分析（Text-to-SQL）
     */
    @Transactional
    public Map<String, Object> analyzeData(String query, Long userId, String domain) {
        long startTime = System.currentTimeMillis();
        Map<String, Object> result = new java.util.HashMap<>();
        String generatedSql = null;
        String errorMessage = null;
        List<Map<String, Object>> data = null;
        
        try {
            // 0. 获取用户数据权限范围
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            String dataScope = user.getDataScope(); // e.g. "Beijing Branch"

            // 1. 获取用户有权限的数据表 schema (根据领域过滤)
            List<DataTable> tables = dataManagementService.getUserTablesByDomain(userId, domain);
            
            if (tables.isEmpty()) {
                // 如果指定领域下没有表，尝试获取所有表（作为回退）
                // tables = dataManagementService.getUserTables(userId);
                // if (tables.isEmpty()) {
                    // Fallback to simulated data if no real tables uploaded
                    Map<String, Object> simResult = analyzeDataSimulated(query);
                    recordAudit(userId, query, "SIMULATED_SQL", "Simulated Data", System.currentTimeMillis() - startTime, 1, null);
                    return simResult;
                // }
            }
            
            // 2. 构建 Prompt 让 AI 生成结构化查询参数 (JSON) 而非直接 SQL
            String schemaDescription = buildSchemaDescription(tables);
            String jsonPrompt = "你是一个数据查询专家。请根据以下数据库 Schema，解析用户的自然语言问题，生成一个结构化的 JSON 查询对象。\n" +
                    "不要直接生成 SQL 语句，而是生成以下格式的 JSON：\n" +
                    "{\n" +
                    "    \"table\": \"目标表名\",\n" +
                    "    \"columns\": [\"列名1\", \"SUM(col2) as total\"], // 列名列表\n" +
                    "    \"filters\": [\n" +
                    "        {\"column\": \"列名\", \"operator\": \"=\", \"value\": \"值\"},\n" +
                    "        {\"column\": \"列名\", \"operator\": \"LIKE\", \"value\": \"%值%\"}\n" +
                    "    ],\n" +
                    "    \"groupBy\": [\"列名\"],\n" +
                    "    \"orderBy\": [\"列名 DESC\"],\n" +
                    "    \"limit\": 100\n" +
                    "}\n" +
                    "\n" +
                    "数据库 Schema:\n" +
                    schemaDescription + "\n" +
                    "\n" +
                    "用户问题: " + query + "\n" +
                    "\n" +
                    "要求:\n" +
                    "1. 只返回 JSON 字符串，不要包含 markdown 格式（如 ```json ... ```）。\n" +
                    "2. 如果无法回答，返回 {\"table\": null, \"error\": \"无法解析\"}。";
                
            HiAgentRequest jsonRequest = HiAgentRequest.builder()
                    .model(hiAgentConfig.getModel())
                    .messages(List.of(HiAgentRequest.Message.builder().role("user").content(jsonPrompt).build()))
                    .temperature(0.1)
                    .maxTokens(500)
                    .stream(false)
                    .build();
            
            HiAgentResponse jsonResponse = chat(jsonRequest);
            String jsonStr = jsonResponse.getChoices().get(0).getMessage().getContent().trim();
            
            // 清理 JSON
            if (jsonStr.contains("```json")) {
                jsonStr = jsonStr.substring(jsonStr.indexOf("```json") + 7);
                if (jsonStr.contains("```")) {
                    jsonStr = jsonStr.substring(0, jsonStr.indexOf("```"));
                }
            } else if (jsonStr.contains("```")) {
                 jsonStr = jsonStr.substring(jsonStr.indexOf("```") + 3);
                 if (jsonStr.contains("```")) {
                    jsonStr = jsonStr.substring(0, jsonStr.indexOf("```"));
                }
            }
            jsonStr = jsonStr.trim();
            
            log.info("AI 生成查询参数: {}", jsonStr);
            
            // 3. 解析 JSON 并使用 SafeQueryBuilder 构建 SQL
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            // 容错处理：如果返回了 error
            if (jsonStr.contains("\"error\"") && jsonStr.contains("\"table\": null")) {
                 throw new RuntimeException("AI 无法理解该问题或缺少相关数据表");
            }
            
            com.bank.bi.util.SafeQueryBuilder.QueryRequest queryRequest = 
                    mapper.readValue(jsonStr, com.bank.bi.util.SafeQueryBuilder.QueryRequest.class);
            
            com.bank.bi.util.SafeQueryBuilder queryBuilder = new com.bank.bi.util.SafeQueryBuilder();
            generatedSql = queryBuilder.buildSql(queryRequest, dataScope);
            
            log.info("生成的安全 SQL: {}", generatedSql);
            
            // 4. 执行 SQL (含自动修复机制)
            int maxRetries = 10;
            int retryCount = 0;
            
            while (retryCount < maxRetries) {
                try {
                    data = dataManagementService.executeQuery(generatedSql);
                    break; // 执行成功，跳出循环
                } catch (Exception e) {
                    retryCount++;
                    log.error("SQL执行失败 (第 {} 次尝试): {}", retryCount, e.getMessage());
                    
                    if (retryCount >= maxRetries) {
                        throw new RuntimeException("SQL执行失败且超过最大重试次数: " + e.getMessage());
                    }
                    
                    // 构造修复 Prompt
                    String repairPrompt = "你是一个 SQL 修复专家。上一次生成的查询参数导致了 SQL 执行错误。请根据错误信息和数据库 Schema，修正并重新生成结构化的 JSON 查询对象。\n" +
                            "\n" +
                            "数据库 Schema:\n" +
                            schemaDescription + "\n" +
                            "\n" +
                            "用户原始问题: " + query + "\n" +
                            "\n" +
                            "失败的 SQL: " + generatedSql + "\n" +
                            "\n" +
                            "错误信息: " + e.getMessage() + "\n" +
                            "\n" +
                            "要求:\n" +
                            "1. 仔细分析错误原因（如列名不存在、类型不匹配、函数使用错误等）。\n" +
                            "2. 输出格式必须与之前一致（仅 JSON）。\n" +
                            "3. 不要输出 SQL，只输出 JSON 配置对象。\n" +
                            "\n" +
                            "JSON 格式示例:\n" +
                            "{\n" +
                            "    \"table\": \"目标表名\",\n" +
                            "    \"columns\": [\"列名1\"],\n" +
                            "    \"filters\": [{\"column\": \"列名\", \"operator\": \"=\", \"value\": \"值\"}]\n" +
                            "}";
                            
                    // 调用 AI 修复
                    HiAgentRequest repairRequest = HiAgentRequest.builder()
                            .model(hiAgentConfig.getModel())
                            .messages(List.of(HiAgentRequest.Message.builder().role("user").content(repairPrompt).build()))
                            .temperature(0.1)
                            .maxTokens(500)
                            .stream(false)
                            .build();
                            
                    HiAgentResponse repairResponse = chat(repairRequest);
                    jsonStr = repairResponse.getChoices().get(0).getMessage().getContent().trim();
                    
                    // 清理 JSON
                    if (jsonStr.contains("```json")) {
                        jsonStr = jsonStr.substring(jsonStr.indexOf("```json") + 7);
                        if (jsonStr.contains("```")) jsonStr = jsonStr.substring(0, jsonStr.indexOf("```"));
                    } else if (jsonStr.contains("```")) {
                        jsonStr = jsonStr.substring(jsonStr.indexOf("```") + 3);
                        if (jsonStr.contains("```")) jsonStr = jsonStr.substring(0, jsonStr.indexOf("```"));
                    }
                    jsonStr = jsonStr.trim();
                    
                    log.info("AI 修复后的查询参数: {}", jsonStr);
                    
                    // 重新解析与构建 SQL
                    if (jsonStr.contains("\"error\"") && jsonStr.contains("\"table\": null")) {
                         throw new RuntimeException("AI 无法修复该查询");
                    }
                    
                    queryRequest = mapper.readValue(jsonStr, com.bank.bi.util.SafeQueryBuilder.QueryRequest.class);
                    generatedSql = queryBuilder.buildSql(queryRequest, dataScope);
                    log.info("修复后的 SQL: {}", generatedSql);
                }
            }
            
            // 4.1 数据脱敏 (Result Masking)
            List<Map<String, Object>> maskedData = new ArrayList<>();
            for (Map<String, Object> row : data) {
                Map<String, Object> maskedRow = new java.util.HashMap<>();
                for (Map.Entry<String, Object> entry : row.entrySet()) {
                    maskedRow.put(entry.getKey(), DataMaskingUtil.smartMask(entry.getKey(), entry.getValue()));
                }
                maskedData.add(maskedRow);
            }
            data = maskedData; 
            
            // 5. 让 AI 分析查询结果 (RAG)
            String dataSummary = mapper.writeValueAsString(data.stream().limit(20).collect(Collectors.toList()));
            String analysisPrompt = "你是一个严谨的数据分析师。请仅基于提供的【查询结果】回答用户的【问题】。\n\n" +
                    "用户问题: " + query + "\n" +
                    "查询结果: " + dataSummary + "\n\n" +
                    "回答要求：\n" +
                    "1. 必须完全基于查询结果回答，严禁编造数据或使用外部知识进行臆测。\n" +
                    "2. 如果查询结果为空，直接回答\"根据当前数据未找到相关信息\"。\n" +
                    "3. 回答要简洁明了，直接引用数据支持结论。";
                
            HiAgentRequest analysisRequest = HiAgentRequest.builder()
                    .model(hiAgentConfig.getModel())
                    .messages(List.of(HiAgentRequest.Message.builder().role("user").content(analysisPrompt).build()))
                    .temperature(0.1)
                    .maxTokens(1000)
                    .stream(false)
                    .build();
                    
            HiAgentResponse analysisResponse = chat(analysisRequest);
            String analysis = analysisResponse.getChoices().get(0).getMessage().getContent();
            
            result.put("response", analysis);
            result.put("sql", generatedSql);
            result.put("data", data);
            result.put("analysis", analysis);
            result.put("visualization", determineVisualization(data));
            
            recordAudit(userId, query, generatedSql, "Rows: " + data.size(), System.currentTimeMillis() - startTime, 1, null);
            
            return result;
            
        } catch (Exception e) {
            log.error("智能分析失败", e);
            errorMessage = e.getMessage();
            result.put("response", "分析失败: " + e.getMessage());
            result.put("error", e.getMessage());
            
            recordAudit(userId, query, generatedSql, null, System.currentTimeMillis() - startTime, 0, errorMessage);
            
            return result;
        }
    }

    private Map<String, Object> determineVisualization(List<Map<String, Object>> data) {
        if (data == null || data.isEmpty()) {
            return null;
        }
        
        Map<String, Object> firstRow = data.get(0);
        
        // Identify X (Label) and Y (Values) columns
        String xKey = null;
        List<String> yKeys = new ArrayList<>();
        
        for (Map.Entry<String, Object> entry : firstRow.entrySet()) {
            if (entry.getValue() instanceof Number) {
                yKeys.add(entry.getKey());
            } else {
                // Prefer columns with "name", "date", "type" as X axis
                if (xKey == null) {
                    xKey = entry.getKey();
                } else {
                    String currentKey = entry.getKey().toLowerCase();
                    String existingKey = xKey.toLowerCase();
                    // If current key looks more like a label, swap it
                    if ((currentKey.contains("name") || currentKey.contains("date") || currentKey.contains("time")) 
                            && !(existingKey.contains("name") || existingKey.contains("date") || existingKey.contains("time"))) {
                        xKey = entry.getKey();
                    }
                }
            }
        }
        
        // If we have at least one number column, we can try to chart
        if (!yKeys.isEmpty()) {
            // Case: All columns are numbers? Pick first as X
            if (xKey == null && yKeys.size() > 1) {
                xKey = yKeys.get(0);
                yKeys.remove(0);
            }
            
            // If we have a valid X and at least one Y
            if (xKey != null) {
                Map<String, Object> vizData = new java.util.HashMap<>();
                vizData.put("xAxisKey", xKey);
                
                // Pass single key for backward compatibility, list for multi-series
                if (yKeys.size() == 1) {
                    vizData.put("yAxisKey", yKeys.get(0));
                } else {
                    vizData.put("yAxisKeys", yKeys);
                }
                
                vizData.put("series", data);
                vizData.put("title", "数据分析图表");
                
                // Determine Chart Type
                // If X axis is time-related -> Line Chart
                // If multiple Y axes -> Bar or Line (prefer Line for trend, Bar for comparison)
                // Default to Bar
                String lowerX = xKey.toLowerCase();
                if (lowerX.contains("date") || lowerX.contains("time") || lowerX.contains("month") || lowerX.contains("year") || lowerX.contains("day")) {
                    vizData.put("chartType", "line");
                } else {
                    vizData.put("chartType", "bar");
                }
                
                return Map.of("type", "chart", "data", vizData);
            }
        }
        
        // Fallback: Table Visualization
        if (!data.isEmpty()) {
             Map<String, Object> vizData = new java.util.HashMap<>();
             List<String> headers = new ArrayList<>(firstRow.keySet());
             List<List<Object>> rows = new ArrayList<>();
             for(Map<String, Object> row : data) {
                 List<Object> rowData = new ArrayList<>();
                 for(String header : headers) {
                     rowData.add(row.get(header));
                 }
                 rows.add(rowData);
             }
             vizData.put("headers", headers);
             vizData.put("rows", rows);
             
             return Map.of("type", "table", "data", vizData);
        }
        
        return null;
    }

    private void recordAudit(Long userId, String query, String sql, String resultSummary, Long time, Integer status, String error) {
        try {
            String username = "Unknown";
            if (userId != null) {
                username = userRepository.findById(userId).map(User::getUsername).orElse("Unknown");
            }
            
            AuditLog log = AuditLog.builder()
                    .userId(userId)
                    .username(username)
                    .operation("AI_DATA_QUERY")
                    .content(query)
                    .sqlStatement(sql)
                    .resultSummary(resultSummary)
                    .executionTime(time)
                    .status(status)
                    .errorMessage(error)
                    .createdTime(LocalDateTime.now())
                    .build();
            auditLogRepository.save(log);
        } catch (Exception e) {
            log.error("Failed to save audit log", e);
        }
    }
    
    private String convertJsonToSql(String jsonStr) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(jsonStr);
            
            String tableName = null;
            if (root.has("tableName")) {
                tableName = root.get("tableName").asText();
            } else if (root.has("table")) {
                tableName = root.get("table").asText();
            } else if (root.has("from")) {
                tableName = root.get("from").asText();
            }
            
            if (tableName == null) {
                throw new RuntimeException("JSON中缺少 tableName 字段");
            }
            
            // 简单的表名校验，防止 SQL 注入
            if (!tableName.matches("^[a-zA-Z0-9_]+$")) {
                throw new RuntimeException("非法表名: " + tableName);
            }
            
            StringBuilder sql = new StringBuilder("SELECT ");
            
            if (root.has("selectColumns") && root.get("selectColumns").isArray()) {
                List<String> cols = new ArrayList<>();
                for (com.fasterxml.jackson.databind.JsonNode col : root.get("selectColumns")) {
                    String colName = col.asText();
                    // 允许 COUNT(*), SUM(col), col
                    if (!colName.matches("^[a-zA-Z0-9_\\*\\(\\)]+$")) {
                        throw new RuntimeException("非法列名: " + colName);
                    }
                    cols.add(colName);
                }
                sql.append(String.join(", ", cols));
            } else if (root.has("select") && root.get("select").isArray()) {
                 List<String> cols = new ArrayList<>();
                for (com.fasterxml.jackson.databind.JsonNode col : root.get("select")) {
                    String colName = col.asText();
                    if (!colName.matches("^[a-zA-Z0-9_\\*\\(\\)]+$")) {
                        throw new RuntimeException("非法列名: " + colName);
                    }
                    cols.add(colName);
                }
                sql.append(String.join(", ", cols));
            } else {
                sql.append("*");
            }
            
            sql.append(" FROM ").append(tableName);
            
            if (root.has("whereConditions") && root.get("whereConditions").isArray() && root.get("whereConditions").size() > 0) {
                sql.append(" WHERE ");
                List<String> conditions = new ArrayList<>();
                for (com.fasterxml.jackson.databind.JsonNode cond : root.get("whereConditions")) {
                    String col = cond.get("column").asText();
                    String op = cond.get("operator").asText();
                    String val = cond.get("value").asText();
                    
                    if (!col.matches("^[a-zA-Z0-9_]+$")) throw new RuntimeException("非法列名");
                    if (!List.of("=", ">", "<", ">=", "<=", "LIKE", "!=", "BETWEEN", "IN").contains(op.toUpperCase())) throw new RuntimeException("非法操作符");
                    
                    if (op.equalsIgnoreCase("BETWEEN")) {
                        String[] vals = val.split(",");
                        if (vals.length == 2) {
                            conditions.add(col + " BETWEEN '" + vals[0].trim().replace("'", "''") + "' AND '" + vals[1].trim().replace("'", "''") + "'");
                        }
                    } else if (op.equalsIgnoreCase("IN")) {
                        String[] vals = val.split(",");
                        String inClause = java.util.Arrays.stream(vals)
                                .map(v -> "'" + v.trim().replace("'", "''") + "'")
                                .collect(Collectors.joining(", "));
                        conditions.add(col + " IN (" + inClause + ")");
                    } else {
                        conditions.add(col + " " + op + " '" + val.replace("'", "''") + "'");
                    }
                }
                sql.append(String.join(" AND ", conditions));
            }
            
            if (root.has("groupBy") && root.get("groupBy").isArray() && root.get("groupBy").size() > 0) {
                sql.append(" GROUP BY ");
                List<String> groups = new ArrayList<>();
                for (com.fasterxml.jackson.databind.JsonNode g : root.get("groupBy")) {
                     String gCol = g.asText();
                     if (!gCol.matches("^[a-zA-Z0-9_]+$")) throw new RuntimeException("非法列名");
                     groups.add(gCol);
                }
                sql.append(String.join(", ", groups));
                
                // 处理 HAVING
                if (root.has("havingConditions") && root.get("havingConditions").isArray() && root.get("havingConditions").size() > 0) {
                    sql.append(" HAVING ");
                    List<String> having = new ArrayList<>();
                    for (com.fasterxml.jackson.databind.JsonNode cond : root.get("havingConditions")) {
                        String col = cond.get("column").asText();
                        String op = cond.get("operator").asText();
                        String val = cond.get("value").asText();
                        
                        // HAVING 允许聚合函数，如 COUNT(*), SUM(amt)
                        if (!col.matches("^[a-zA-Z0-9_\\*\\(\\)]+$")) throw new RuntimeException("非法聚合列名");
                        if (!List.of("=", ">", "<", ">=", "<=", "!=").contains(op)) throw new RuntimeException("非法操作符");
                        
                        having.add(col + " " + op + " " + val.replace("'", "''")); // 数值通常不需要引号，但为了简单暂且... 实际上应该判断类型
                    }
                    sql.append(String.join(" AND ", having));
                }
            }
            
            if (root.has("orderBy") && !root.get("orderBy").isNull()) {
                com.fasterxml.jackson.databind.JsonNode order = root.get("orderBy");
                if (order.has("column")) {
                    String col = order.get("column").asText();
                    String dir = order.has("direction") ? order.get("direction").asText() : "ASC";
                    if (!col.matches("^[a-zA-Z0-9_]+$")) throw new RuntimeException("非法列名");
                    if (!dir.matches("^(ASC|DESC)$")) throw new RuntimeException("非法排序方向");
                    sql.append(" ORDER BY ").append(col).append(" ").append(dir);
                }
            }
            
            int limit = root.has("limit") ? root.get("limit").asInt() : 100;
            sql.append(" LIMIT ").append(Math.min(limit, 1000));
            
            return sql.toString();
        } catch (Exception e) {
            throw new RuntimeException("JSON 转 SQL 失败: " + e.getMessage() + " | JSON: " + jsonStr);
        }
    }
    
    private void validateSql(String sql) {
        String upperSql = sql.toUpperCase().trim();
        if (!upperSql.startsWith("SELECT")) {
            throw new RuntimeException("只允许 SELECT 查询");
        }
        if (upperSql.contains("UPDATE ") || upperSql.contains("DELETE ") || upperSql.contains("DROP ") || upperSql.contains("INSERT ")) {
            throw new RuntimeException("检测到非法写操作指令");
        }
        if (upperSql.contains(";") || upperSql.contains("--")) {
             throw new RuntimeException("检测到 SQL 注入风险字符");
        }
    }
    
    private String buildSchemaDescription(List<DataTable> tables) {
        StringBuilder sb = new StringBuilder();
        for (DataTable table : tables) {
            sb.append("Table: ").append(table.getTableName())
              .append(" (").append(table.getDisplayName()).append(")\n");
            sb.append("Columns:\n");
            for (DataColumn col : table.getColumns()) {
                sb.append("  - ").append(col.getColumnName())
                  .append(" (").append(col.getDataType()).append(")");
                if (col.getDisplayName() != null) {
                    sb.append(" : ").append(col.getDisplayName());
                }
                sb.append("\n");
            }
            sb.append("\n");
        }
        return sb.toString();
    }
    
    // 保留旧的模拟方法作为 Fallback
    private Map<String, Object> analyzeDataSimulated(String query) {
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        
        // 1. 模拟 SQL 生成
        String sql;
        java.util.List<java.util.Map<String, Object>> data = new java.util.ArrayList<>();
        
        if (query.contains("存款")) {
            sql = "SELECT product_type, SUM(balance) as total_balance FROM deposit_accounts WHERE date = '2024-03-15' GROUP BY product_type";
            data.add(java.util.Map.of("product_type", "活期存款", "total_balance", 152300000));
            data.add(java.util.Map.of("product_type", "定期存款", "total_balance", 284500000));
            data.add(java.util.Map.of("product_type", "大额存单", "total_balance", 89200000));
        } else if (query.contains("贷款")) {
            sql = "SELECT loan_type, COUNT(*) as count, AVG(interest_rate) as avg_rate FROM loan_contracts WHERE status = 'ACTIVE' GROUP BY loan_type";
            data.add(java.util.Map.of("loan_type", "个人住房贷款", "count", 1250, "avg_rate", 3.85));
            data.add(java.util.Map.of("loan_type", "经营性贷款", "count", 480, "avg_rate", 4.25));
            data.add(java.util.Map.of("loan_type", "消费贷", "count", 3200, "avg_rate", 5.60));
        } else {
            sql = "SELECT * FROM customer_summary LIMIT 5";
            data.add(java.util.Map.of("customer_id", "C001", "name", "某科技公司", "segment", "对公"));
            data.add(java.util.Map.of("customer_id", "C002", "name", "张三", "segment", "零售VIP"));
        }
        
        // 2. 调用 AI 解释数据
        String systemPrompt = """
            你是一个数据分析师。请根据提供的【查询SQL】和【查询结果】，回答用户的【问题】。
            回答要求：
            1. 先直接回答问题的核心结论。
            2. 引用数据支持你的结论。
            3. 如果有必要，指出数据的局限性或建议进一步的分析。
            """;
            
        String userContent = "【问题】" + query + "\n\n【查询SQL】" + sql + "\n\n【查询结果】" + data.toString();
        
        List<HiAgentRequest.Message> messages = new ArrayList<>();
        messages.add(HiAgentRequest.Message.builder().role("system").content(systemPrompt).build());
        messages.add(HiAgentRequest.Message.builder().role("user").content(userContent).build());
        
        HiAgentRequest request = HiAgentRequest.builder()
                .model(hiAgentConfig.getModel())
                .messages(messages)
                .temperature(0.5)
                .maxTokens(1000)
                .stream(false)
                .build();
                
        String analysis = "无法生成分析结果";
        try {
            HiAgentResponse response = chat(request);
            if (response != null && !response.getChoices().isEmpty()) {
                analysis = response.getChoices().get(0).getMessage().getContent();
            }
        } catch (Exception e) {
            log.error("AI分析失败", e);
            analysis = "AI服务暂时无法响应，请稍后再试。";
        }
        
        result.put("response", analysis);
        result.put("sql", sql);
        result.put("data", data);
        result.put("analysis", analysis);
        
        return result;
    }
}
