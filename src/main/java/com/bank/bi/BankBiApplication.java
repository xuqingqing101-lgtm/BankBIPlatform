package com.bank.bi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication(exclude = {RedisAutoConfiguration.class})
@EnableConfigurationProperties
public class BankBiApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankBiApplication.class, args);
        System.out.println("""
            
            ========================================
            🏦 银行智能AI分析平台已启动
            ========================================
            API地址: http://localhost:8080/api
            H2控制台: http://localhost:8080/api/h2-console
            Swagger文档: http://localhost:8080/api/swagger-ui.html
            ========================================
            AI服务: 字节HiAgent
            数据库: H2 (开发环境)
            ⚠️  Redis: 已禁用（开发环境）
            🔓 安全: 已禁用认证（开发环境）
            ========================================
            """);
    }
}
