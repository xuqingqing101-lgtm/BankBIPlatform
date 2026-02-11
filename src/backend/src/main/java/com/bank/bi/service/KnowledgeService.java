package com.bank.bi.service;

import com.bank.bi.config.HiAgentConfig;
import com.bank.bi.model.dto.HiAgentRequest;
import com.bank.bi.model.dto.HiAgentResponse;
import com.bank.bi.model.entity.KnowledgeDocument;
import com.bank.bi.model.entity.Role;
import com.bank.bi.model.entity.User;
import com.bank.bi.repository.KnowledgeDocumentRepository;
import com.bank.bi.repository.RoleRepository;
import com.bank.bi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 知识库服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeService {

    private final HiAgentService hiAgentService;
    private final HiAgentConfig hiAgentConfig;
    private final KnowledgeDocumentRepository documentRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:uploads/knowledge}")
    private String uploadDir;

    private final Tika tika = new Tika();

    /**
     * 上传知识库文档 (File)
     */
    @Transactional
    public KnowledgeDocument uploadDocument(File sourceFile, Long uploaderId, List<String> roleCodes) {
        try {
            // 1. 验证并保存文件
            File dir = new File(uploadDir);
            if (!dir.isAbsolute()) {
                dir = new File(System.getProperty("user.dir"), uploadDir);
            }
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            String originalFilename = sourceFile.getName();
            String extension = "";
            if (originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
            }
            String storedFilename = UUID.randomUUID().toString() + "." + extension;
            File destFile = new File(dir, storedFilename);
            
            // 复制文件
            org.springframework.util.FileCopyUtils.copy(sourceFile, destFile);

            // 2. 提取文本内容
            String content = extractText(destFile);

            // 3. 获取角色权限
            Set<Role> allowedRoles = new HashSet<>();
            if (roleCodes != null && !roleCodes.isEmpty()) {
                for (String code : roleCodes) {
                    roleRepository.findByRoleCode(code).ifPresent(allowedRoles::add);
                }
            }

            // 4. 保存实体
            KnowledgeDocument document = KnowledgeDocument.builder()
                    .title(originalFilename)
                    .fileName(originalFilename)
                    .filePath(destFile.getAbsolutePath())
                    .fileType(extension)
                    .content(content)
                    .uploadedBy(uploaderId)
                    .createdTime(LocalDateTime.now())
                    .allowedRoles(allowedRoles)
                    .build();

            return documentRepository.save(document);

        } catch (IOException e) {
            log.error("文件上传失败", e);
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 上传知识库文档 (MultipartFile)
     */
    @Transactional
    public KnowledgeDocument uploadDocument(MultipartFile file, Long uploaderId, List<String> roleCodes) {
        try {
            // 1. 验证并保存文件
            File dir = new File(uploadDir);
            if (!dir.isAbsolute()) {
                dir = new File(System.getProperty("user.dir"), uploadDir);
            }
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
            String storedFilename = UUID.randomUUID().toString() + "." + extension;
            File destFile = new File(dir, storedFilename);
            file.transferTo(destFile.getAbsoluteFile());

            // 2. 提取文本内容
            String content = extractText(destFile);

            // 3. 获取角色权限
            Set<Role> allowedRoles = new HashSet<>();
            if (roleCodes != null && !roleCodes.isEmpty()) {
                for (String code : roleCodes) {
                    roleRepository.findByRoleCode(code).ifPresent(allowedRoles::add);
                }
            }

            // 4. 保存实体
            KnowledgeDocument document = KnowledgeDocument.builder()
                    .title(originalFilename)
                    .fileName(originalFilename)
                    .filePath(destFile.getAbsolutePath())
                    .fileType(extension)
                    .content(content)
                    .uploadedBy(uploaderId)
                    .createdTime(LocalDateTime.now())
                    .allowedRoles(allowedRoles)
                    .build();

            return documentRepository.save(document);

        } catch (IOException e) {
            log.error("文件上传失败", e);
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }

    private String extractText(File file) {
        try {
            // Tika 自动检测类型并提取文本
            String text = tika.parseToString(file);
            
            // 如果 Tika 提取内容为空，且是图片，则提示
            String fileName = file.getName().toLowerCase();
            if ((text == null || text.trim().isEmpty()) && 
                (fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".bmp"))) {
                return "[图片文档] " + fileName + " (未安装OCR组件，仅存储文件)";
            }
            
            // 简单清洗，限制长度
            return text.length() > 50000 ? text.substring(0, 50000) : text;
        } catch (Exception e) {
            log.warn("文本提取失败: {}", file.getName(), e);
            return "";
        }
    }

    /**
     * 智能问答（RAG）
     */
    public Map<String, Object> ask(String query, Long userId) {
        // 1. 检索相关文档 (Retrieve) - 基于用户角色过滤
        List<KnowledgeDocument> sources = search(query, userId);
        
        // 2. 构建上下文 (Context)
        StringBuilder contextBuilder = new StringBuilder();
        if (sources.isEmpty()) {
            contextBuilder.append("没有找到相关文档。");
        } else {
            for (int i = 0; i < Math.min(sources.size(), 3); i++) { // 最多取前3个相关文档
                KnowledgeDocument doc = sources.get(i);
                // 截取前1000个字符作为摘要，或者更智能的片段截取（这里简化处理）
                String snippet = doc.getContent().length() > 500 ? doc.getContent().substring(0, 500) + "..." : doc.getContent();
                contextBuilder.append(String.format("[文档%d: %s]\n%s\n\n", 
                    i + 1, doc.getTitle(), snippet));
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
                .temperature(0.3)
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
        result.put("sources", sources.stream()
                .map(d -> Map.of("id", d.getId(), "title", d.getTitle(), "type", d.getFileType()))
                .collect(Collectors.toList()));
        return result;
    }

    /**
     * 搜索文档
     */
    public List<KnowledgeDocument> search(String query, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("用户不存在"));
        Set<Long> roleIds = user.getRoles().stream().map(Role::getRoleId).collect(Collectors.toSet());
        
        if (roleIds.isEmpty()) {
            return Collections.emptyList();
        }
        
        return documentRepository.searchByKeywordAndRoles(query, roleIds);
    }
}
