package com.bank.bi.init;

import com.bank.bi.model.entity.Role;
import com.bank.bi.model.entity.User;
import com.bank.bi.repository.RoleRepository;
import com.bank.bi.repository.UserRepository;
import com.bank.bi.repository.KnowledgeDocumentRepository;
import com.bank.bi.repository.data.DataTableRepository;
import com.bank.bi.service.DataManagementService;
import com.bank.bi.service.KnowledgeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final KnowledgeService knowledgeService;
    private final DataManagementService dataManagementService;
    private final KnowledgeDocumentRepository knowledgeDocumentRepository;
    private final DataTableRepository dataTableRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("开始数据初始化检查...");

        // 1. 确保默认用户存在
        User adminUser = ensureAdminUser();

        // 2. 预置知识库文档
        preloadKnowledge(adminUser);

        // 3. 预置数据表 (使用 V2 逻辑)
        preloadDataV2(adminUser);
        
        log.info("数据初始化完成。");
    }

    // ... (ensureAdminUser and preloadKnowledge kept as is, but hidden here for brevity)
    private User ensureAdminUser() {
        return userRepository.findByUsername("admin").orElseGet(() -> {
            log.info("创建默认管理员用户...");
            Role adminRole = java.util.Objects.requireNonNull(roleRepository.findByRoleCode("ADMIN").orElseGet(() -> roleRepository.save(Role.builder().roleCode("ADMIN").roleName("管理员").build())));
            Role userRole = java.util.Objects.requireNonNull(roleRepository.findByRoleCode("USER").orElseGet(() -> roleRepository.save(Role.builder().roleCode("USER").roleName("普通用户").build())));
            User user = User.builder().username("admin").password("{noop}123456").realName("系统管理员").status(1).roles(new HashSet<>(Arrays.asList(adminRole, userRole))).build();
            return java.util.Objects.requireNonNull(userRepository.save(user));
        });
    }

    private void preloadKnowledge(User user) {
        File dir = findPreloadDir("knowledge");
        if (dir == null) { new File(System.getProperty("user.dir"), "preload/knowledge").mkdirs(); return; }
        File[] files = dir.listFiles();
        if (files == null) return;
        for (File file : files) {
            if (file.isFile() && !file.getName().startsWith(".")) {
                if (!knowledgeDocumentRepository.existsByFileName(file.getName())) {
                    try {
                        log.info("正在导入知识库文档: {}", file.getName());
                        knowledgeService.uploadDocument(file, user.getUserId(), Arrays.asList("ADMIN", "USER"));
                    } catch (Exception e) {
                        log.error("导入知识库文档失败: " + file.getName(), e);
                    }
                }
            }
        }
    }

    private void preloadDataV2(User user) {
        // 1. 查找 Schema 文件
        File dbInitDir = findPreloadDir("data/new_v2/db_init");
        if (dbInitDir == null) {
            log.warn("未找到 new_v2/db_init 目录，跳过数据初始化");
            return;
        }

        // 2. 导入 Schema (schema_all.csv)
        File schemaFile = new File(dbInitDir, "schema_all.csv");
        if (schemaFile.exists()) {
            try {
                log.info("正在导入 Schema: {}", schemaFile.getName());
                try (FileInputStream fis = new FileInputStream(schemaFile)) {
                    MultipartFile mf = new SimpleMultipartFile(schemaFile.getName(), fis);
                    dataManagementService.importSchema(mf, user.getUserId());
                }
            } catch (Exception e) {
                log.error("导入 Schema 失败", e);
            }
        } else {
            log.warn("未找到 schema_all.csv，可能导致后续数据导入失败");
        }

        // 3. 导入数据 (其他 CSV)
        File[] files = dbInitDir.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile() && file.getName().toLowerCase().endsWith(".csv") && !file.getName().equals("schema_all.csv")) {
                    String tableName = file.getName().substring(0, file.getName().lastIndexOf("."));
                    // 检查是否已导入数据 (简单判断：行数是否 > 0，或者直接覆盖)
                    // 这里我们假设初始化时总是覆盖
                    try {
                        log.info("正在导入数据: {}", tableName);
                        try (FileInputStream fis = new FileInputStream(file)) {
                            MultipartFile mf = new SimpleMultipartFile(file.getName(), fis);
                            dataManagementService.importData(mf, "overwrite", user.getUserId());
                        }
                    } catch (Exception e) {
                        log.error("导入数据失败: " + file.getName(), e);
                    }
                }
            }
        }
    }

    // 简单的 MultipartFile 实现，避免依赖 spring-test
    static class SimpleMultipartFile implements MultipartFile {
        private final String name;
        private final byte[] content;

        public SimpleMultipartFile(String name, InputStream inputStream) throws IOException {
            this.name = name;
            this.content = inputStream.readAllBytes();
        }

        @Override public String getName() { return "file"; }
        @Override public String getOriginalFilename() { return name; }
        @Override public String getContentType() { return "text/csv"; }
        @Override public boolean isEmpty() { return content.length == 0; }
        @Override public long getSize() { return content.length; }
        @Override public byte[] getBytes() throws IOException { return content; }
        @Override public InputStream getInputStream() throws IOException { return new java.io.ByteArrayInputStream(content); }
        @Override public void transferTo(File dest) throws IOException, IllegalStateException { 
            try (java.io.FileOutputStream fos = new java.io.FileOutputStream(dest)) { fos.write(content); }
        }
    }

    private File findPreloadDir(String subDir) {
        String[] paths = {
            "preload/" + subDir,
            "../preload/" + subDir,
            "../../preload/" + subDir,
            "src/backend/preload/" + subDir
        };
        
        for (String path : paths) {
            File dir = new File(System.getProperty("user.dir"), path);
            if (dir.exists() && dir.isDirectory()) {
                log.info("找到预置目录: {}", dir.getAbsolutePath());
                return dir;
            }
        }
        return null;
    }
}

