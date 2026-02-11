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
        return WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
