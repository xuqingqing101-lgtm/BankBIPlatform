package com.bank.bi.util;

import org.springframework.util.StringUtils;

/**
 * 数据脱敏工具类
 */
public class DataMaskingUtil {

    /**
     * 脱敏姓名 (张三 -> 张**, 欧阳锋 -> 欧**)
     */
    public static String maskName(String name) {
        if (!StringUtils.hasText(name)) return name;
        return name.substring(0, 1) + "**";
    }

    /**
     * 脱敏手机号 (13812345678 -> 138****5678)
     */
    public static String maskPhone(String phone) {
        if (!StringUtils.hasText(phone) || phone.length() < 11) return phone;
        return phone.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2");
    }

    /**
     * 脱敏身份证号 (110101199003071234 -> 110***********1234)
     */
    public static String maskIdCard(String idCard) {
        if (!StringUtils.hasText(idCard) || idCard.length() < 15) return idCard;
        // 前3后4
        return idCard.substring(0, 3) + "*".repeat(idCard.length() - 7) + idCard.substring(idCard.length() - 4);
    }

    /**
     * 脱敏银行卡号 (保留前4后4)
     */
    public static String maskBankCard(String cardNo) {
        if (!StringUtils.hasText(cardNo) || cardNo.length() < 10) return cardNo;
        return cardNo.substring(0, 4) + "*".repeat(cardNo.length() - 8) + cardNo.substring(cardNo.length() - 4);
    }
    
    /**
     * 智能脱敏：根据列名尝试脱敏
     */
    public static Object smartMask(String columnName, Object value) {
        if (value == null) return null;
        if (!(value instanceof String)) return value;
        
        String strVal = (String) value;
        String col = columnName.toLowerCase();
        
        if (col.contains("name") || col.contains("姓名")) {
            return maskName(strVal);
        }
        if (col.contains("phone") || col.contains("mobile") || col.contains("tel") || col.contains("手机")) {
            return maskPhone(strVal);
        }
        if (col.contains("id_card") || col.contains("sfz") || col.contains("证件")) {
            return maskIdCard(strVal);
        }
        if (col.contains("card_no") || col.contains("acct") || col.contains("account") || col.contains("账号")) {
            return maskBankCard(strVal);
        }
        
        return value;
    }
}
