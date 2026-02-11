package com.bank.bi.service;

import com.bank.bi.config.HiAgentConfig;
import com.bank.bi.model.dto.HiAgentRequest;
import com.bank.bi.model.dto.HiAgentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 知识库服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeService {

    private final HiAgentService hiAgentService;
    private final HiAgentConfig hiAgentConfig;

    /**
     * 智能问答（RAG）
     */
    public Map<String, Object> ask(String query) {
        // 1. 检索相关文档 (Retrieve)
        List<Map<String, Object>> sources = search(query);
        
        // 2. 构建上下文 (Context)
        StringBuilder contextBuilder = new StringBuilder();
        if (sources.isEmpty()) {
            contextBuilder.append("没有找到相关文档。");
        } else {
            for (int i = 0; i < sources.size(); i++) {
                Map<String, Object> doc = sources.get(i);
                contextBuilder.append(String.format("[文档%d] %s\n%s\n\n", 
                    i + 1, doc.get("title"), doc.get("snippet")));
            }
        }
        
        // 3. 构建AI请求 (Generate)
        String systemPrompt = """
            你是一个专业的银行知识库助手。请严格基于提供的【参考文档】回答用户的问题。
            如果在【参考文档】中找不到答案，请直接说明“抱歉，知识库中暂时没有相关信息”，不要编造答案。
            回答要求：准确、简洁、分点表述。引用文档时请标注[文档x]。
            """;
            
        String userContent = String.format("【参考文档】\n%s\n\n【用户问题】\n%s", 
            contextBuilder.toString(), query);
            
        List<HiAgentRequest.Message> messages = new ArrayList<>();
        messages.add(HiAgentRequest.Message.builder().role("system").content(systemPrompt).build());
        messages.add(HiAgentRequest.Message.builder().role("user").content(userContent).build());
        
        HiAgentRequest request = HiAgentRequest.builder()
                .model(hiAgentConfig.getModel())
                .messages(messages)
                .temperature(0.3) // 知识库问答降低创造性
                .maxTokens(1000)
                .stream(false)
                .build();
                
        String answer;
        try {
            HiAgentResponse response = hiAgentService.chat(request);
            if (response != null && !response.getChoices().isEmpty()) {
                answer = response.getChoices().get(0).getMessage().getContent();
            } else {
                answer = "AI服务暂时无法响应，请稍后再试。";
            }
        } catch (Exception e) {
            log.error("AI问答失败", e);
            answer = "抱歉，处理您的问题时出现错误。";
        }
        
        // 4. 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("answer", answer);
        result.put("sources", sources);
        return result;
    }

    public List<Map<String, Object>> search(String query) {
        List<Map<String, Object>> results = new ArrayList<>();
        
        // 模拟搜索结果
        Map<String, Object> doc1 = new HashMap<>();
        doc1.put("id", 1);
        doc1.put("title", "个人存款业务管理办法 (2025版)");
        doc1.put("type", "制度文件");
        doc1.put("date", "2025-01-15");
        doc1.put("snippet", "本办法规定了个人存款业务的操作流程和风险控制要求，适用于全行各网点...");
        results.add(doc1);
        
        Map<String, Object> doc2 = new HashMap<>();
        doc2.put("id", 2);
        doc2.put("title", "小微企业信贷审批指引");
        doc2.put("type", "操作指引");
        doc2.put("date", "2025-02-01");
        doc2.put("snippet", "针对小微企业信贷审批中的常见问题，明确了审查重点和风险把控标准...");
        results.add(doc2);
        
        return results;
    }
}
