package com.bank.bi.skill;

import lombok.Data;

import java.util.List;

@Data
public class SkillDefinition {
    private String code; // inferred from directory or front matter
    private String name;
    private String description;
    private List<String> triggerKeywords; // from front matter: trigger_keywords
    private String version;
    private String author;
    
    // Content of SKILL.md body
    private String instruction; 
    
    // Parsed from front matter
    private Object schema; // Map or List
    
    // Paths to helper files (relative to skill dir)
    private String basePath; 
}
