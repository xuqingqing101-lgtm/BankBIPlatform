package com.bank.bi.controller;

import com.bank.bi.service.KnowledgeService;
import com.bank.bi.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public ResponseUtil.Result<List<Map<String, Object>>> search(
            @RequestParam("q") String query,
            HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            var results = knowledgeService.search(query, userId);
            var mappedResults = results.stream()
                    .map(d -> Map.of(
                            "id", (Object)d.getId(), 
                            "title", d.getTitle(), 
                            "type", d.getFileType(),
                            "snippet", d.getContent().length() > 100 ? d.getContent().substring(0, 100) + "..." : d.getContent()
                    ))
                    .collect(Collectors.toList());
            return ResponseUtil.success(mappedResults);
        } catch (Exception e) {
            log.error("知识库搜索失败", e);
            return ResponseUtil.error(e.getMessage());
        }
    }

    @PostMapping("/ask")
    public ResponseUtil.Result<Map<String, Object>> ask(
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        String query = body.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseUtil.error("问题不能为空");
        }
        try {
            Long userId = getUserId(request);
            return ResponseUtil.success(knowledgeService.ask(query, userId));
        } catch (Exception e) {
            log.error("知识库问答失败", e);
            return ResponseUtil.error("问答服务异常: " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseUtil.Result<String> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "roles", required = false) List<String> roles,
            HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            knowledgeService.uploadDocument(file, userId, roles);
            return ResponseUtil.success("文档上传成功");
        } catch (Exception e) {
            log.error("文档上传失败", e);
            return ResponseUtil.error("上传失败: " + e.getMessage());
        }
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
