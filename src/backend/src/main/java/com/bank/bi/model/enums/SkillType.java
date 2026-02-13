package com.bank.bi.model.enums;

import lombok.Getter;

@Getter
public enum SkillType {
    CHIT_CHAT("chit_chat", "闲聊", "用户进行日常问候、感谢或与银行业务无关的对话"),
    DATA_QUERY("data_query", "数据查询", "用户想要查询具体的银行业务数据，如存款余额、贷款记录、交易明细等，通常涉及具体的数字、时间范围或统计指标"),
    KNOWLEDGE_BASE("knowledge_base", "知识问答", "用户询问银行业务规则、流程、政策或产品介绍等非结构化信息，需要查阅文档库"),
    CHART_GENERATION("chart_generation", "图表生成", "用户明确要求生成图表、可视化报表或趋势图");

    private final String code;
    private final String name;
    private final String description;

    SkillType(String code, String name, String description) {
        this.code = code;
        this.name = name;
        this.description = description;
    }
}
