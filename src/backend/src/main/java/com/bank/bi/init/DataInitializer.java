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
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

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

        // 3. 预置数据表
        preloadData(adminUser);
        
        log.info("数据初始化完成。");
    }

    private User ensureAdminUser() {
        return userRepository.findByUsername("admin").orElseGet(() -> {
            log.info("创建默认管理员用户...");
            
            // 确保角色存在
            Role adminRole = roleRepository.findByRoleCode("ADMIN").orElseGet(() -> 
                roleRepository.save(Role.builder().roleCode("ADMIN").roleName("管理员").build()));
            Role userRole = roleRepository.findByRoleCode("USER").orElseGet(() -> 
                roleRepository.save(Role.builder().roleCode("USER").roleName("普通用户").build()));

            User user = User.builder()
                    .username("admin")
                    .password("{noop}123456") // 假设使用简单的密码编码或无编码
                    .realName("系统管理员")
                    .status(1)
                    .roles(new HashSet<>(Arrays.asList(adminRole, userRole)))
                    .build();
            return userRepository.save(user);
        });
    }

    private void preloadKnowledge(User user) {
        File dir = findPreloadDir("knowledge");
        if (dir == null) {
            // 如果没找到，尝试在当前目录下创建，方便用户知道位置
            new File(System.getProperty("user.dir"), "preload/knowledge").mkdirs();
            return;
        }

        File[] files = dir.listFiles();
        if (files == null) return;

        for (File file : files) {
            if (file.isFile() && !file.getName().startsWith(".")) {
                if (!knowledgeDocumentRepository.existsByFileName(file.getName())) {
                    try {
                        log.info("正在导入知识库文档: {}", file.getName());
                        // 默认赋予所有角色权限
                        knowledgeService.uploadDocument(file, user.getUserId(), Arrays.asList("ADMIN", "USER"));
                    } catch (Exception e) {
                        log.error("导入知识库文档失败: " + file.getName(), e);
                    }
                }
            }
        }
    }

    private void preloadData(User user) {
        File dir = findPreloadDir("data");
        if (dir == null) {
            new File(System.getProperty("user.dir"), "preload/data").mkdirs();
            return;
        }

        File[] files = dir.listFiles();
        if (files == null) return;

        for (File file : files) {
            if (file.isFile() && file.getName().toLowerCase().endsWith(".csv")) {
                String tableName = file.getName().substring(0, file.getName().lastIndexOf("."));
                if (!dataTableRepository.existsByDisplayName(tableName)) {
                    try {
                        log.info("正在导入数据表: {}", tableName);
                        dataManagementService.uploadData(file, tableName, user.getUserId());
                    } catch (Exception e) {
                        log.error("导入数据表失败: " + file.getName(), e);
                    }
                }
            }
        }
    }

    private File findPreloadDir(String subDir) {
        String[] paths = {
            "preload/" + subDir,
            "../preload/" + subDir,
            "../../preload/" + subDir
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
