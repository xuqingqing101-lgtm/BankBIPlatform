package com.bank.bi.skill;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SkillRegistry {

    private final ObjectMapper objectMapper;

    @Getter
    private final Map<String, SkillDefinition> skills = new HashMap<>();

    @Getter
    private final Map<String, String> layerContents = new HashMap<>(); // key: skills/<code>/<layer>.md

    @PostConstruct
    public void load() {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            // Look for SKILL.md in any subdirectory of skills/
            Resource[] skillFiles = resolver.getResources("classpath*:skills/*/SKILL.md");
            
            for (Resource skillFile : skillFiles) {
                String url = skillFile.getURL().toString();
                // Extract code from parent directory name: .../skills/<code>/SKILL.md
                String code = url.replaceAll(".*/skills/([^/]+)/SKILL\\.md$", "$1");
                
                try (InputStream is = skillFile.getInputStream()) {
                    String content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    SkillDefinition def = parseSkillMd(content);
                    
                    if (def != null) {
                        def.setCode(code);
                        def.setBasePath("skills/" + code);
                        skills.put(code, def);
                        log.info("Loaded skill: {}", code);
                    }
                }
            }
            log.info("Total skills loaded: {}", skills.size());
        } catch (Exception e) {
            log.error("Failed to load skills", e);
        }
    }

    private SkillDefinition parseSkillMd(String content) {
        // Parse YAML Front Matter
        // Structure:
        // ---
        // key: value
        // ---
        // markdown body
        
        if (!content.startsWith("---")) {
            return null;
        }
        
        int endYaml = content.indexOf("\n---", 3);
        if (endYaml == -1) {
            return null;
        }
        
        String yamlPart = content.substring(3, endYaml).trim();
        String bodyPart = content.substring(endYaml + 4).trim();
        
        SkillDefinition def = new SkillDefinition();
        def.setInstruction(bodyPart);
        
        // Simple YAML parsing (assuming flat structure as per requirement)
        // For complex YAML, we should use SnakeYAML, but here we do manual parsing to avoid dependency issues if any.
        // Or better, use Jackson YAML if available, but let's stick to simple line parsing for "name: value"
        
        String[] lines = yamlPart.split("\n");
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty() || line.startsWith("#")) continue;
            
            int colon = line.indexOf(":");
            if (colon > 0) {
                String key = line.substring(0, colon).trim();
                String value = line.substring(colon + 1).trim();
                
                // Remove quotes if present
                if ((value.startsWith("\"") && value.endsWith("\"")) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length() - 1);
                }
                
                switch (key) {
                     case "name": def.setName(value); break;
                     case "description": def.setDescription(value); break;
                     case "version": def.setVersion(value); break;
                     case "author": def.setAuthor(value); break;
                     case "trigger_keywords":
                         // Handle list in simple way (assuming single line [a, b] or multiline not supported by this simple parser)
                         // If user uses multiline YAML list, this simple parser will fail.
                         // Let's try to handle simple inline list [a, b]
                         if (value.startsWith("[") && value.endsWith("]")) {
                             String[] kws = value.substring(1, value.length() - 1).split(",");
                             def.setTriggerKeywords(Arrays.stream(kws).map(String::trim).collect(Collectors.toList()));
                         } else {
                            // Fallback or multiline logic needed if we want full support.
                            // For now, let's assume the user provided format is strictly followed or use SnakeYAML if possible.
                            // Given "no external network", I'll try to use SnakeYAML if it's in classpath (Spring Boot Starter Web usually has it via starter-json -> jackson-dataformat-yaml or similar, or snakeyaml directly).
                            // Let's rely on manual parsing for now but enhance it slightly for the provided example structure.
                         }
                         break;
                     // Handle schema (simple JSON string or basic object)
                     // Since schema can be complex, we rely on SnakeYAML below. 
                     // But if SnakeYAML fails, we might want to support basic "schema: {...}" JSON inline.
                 }
             } else if (line.startsWith("- ")) {
                 // Handling list items if previous key was trigger_keywords
                 // This is a bit stateful and complex for manual parsing.
                 // Let's use org.yaml.snakeyaml.Yaml if available.
             }
         }
         
         // Let's try to use SnakeYAML which is standard in Spring Boot
         try {
             org.yaml.snakeyaml.Yaml yaml = new org.yaml.snakeyaml.Yaml();
             Map<String, Object> data = yaml.load(yamlPart);
             
             def.setName((String) data.get("name"));
             def.setDescription((String) data.get("description"));
             def.setVersion((String) data.getOrDefault("version", "1.0"));
             def.setAuthor((String) data.get("author"));
             
             Object keywords = data.get("trigger_keywords");
             if (keywords instanceof List) {
                 def.setTriggerKeywords((List<String>) keywords);
             }
             
             // Parse schema
             if (data.containsKey("schema")) {
                 def.setSchema(data.get("schema"));
             }
             
         } catch (Throwable t) {
             log.warn("SnakeYAML not available or parsing failed, falling back to simple parser", t);
             // Fallback manual parsing logic (simplified)
         }
        
        return def;
    }

    public List<SkillDefinition> list() {
        return skills.values().stream()
                .sorted(Comparator.comparing(SkillDefinition::getCode))
                .collect(Collectors.toList());
    }

    public Optional<SkillDefinition> get(String code) {
        return Optional.ofNullable(skills.get(code));
    }
}
