package com.bank.bi.controller;

import com.bank.bi.service.KnowledgeService;
import com.bank.bi.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 知识库控制器
 */
@Slf4j
@RestController
@RequestMapping("/knowledge")
@RequiredArgsConstructor
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    @GetMapping("/search")
    public ResponseUtil.Result<List<Map<String, Object>>> search(@RequestParam("q") String query) {
        try {
            return ResponseUtil.success(knowledgeService.search(query));
        } catch (Exception e) {
            log.error("知识库搜索失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }

    @PostMapping("/ask")
    public ResponseUtil.Result<Map<String, Object>> ask(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseUtil.error("问题不能为空");
        }
        try {
            return ResponseUtil.success(knowledgeService.ask(query));
        } catch (Exception e) {
            log.error("知识库问答失败", e);
            return ResponseUtil.error("问答服务异常: " + e.getMessage());
        }
    }
}
