package com.bank.bi.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * HiAgent配置
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "hiagent")
public class HiAgentConfig {
    
    private String apiUrl;
    private String apiKey;
    private String model;
    private Integer timeout;
    private Integer maxTokens;
    private Double temperature;
    
    @Bean
    public WebClient hiAgentWebClient() {
        String base = java.util.Objects.requireNonNull(apiUrl, "hiagent.apiUrl must not be null");
        String key = java.util.Objects.requireNonNull(apiKey, "hiagent.apiKey must not be null");
        return WebClient.builder()
                .baseUrl(base)
                .defaultHeader("Authorization", "Bearer " + key)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
