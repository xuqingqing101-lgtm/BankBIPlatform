package com.bank.bi.controller;

import com.bank.bi.init.DataInitializer;
import com.bank.bi.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/system")
@RequiredArgsConstructor
public class SystemController {

    private final DataInitializer dataInitializer;

    @PostMapping("/preload")
    public ResponseUtil.Result<String> triggerPreload() {
        try {
            log.info("手动触发数据预置...");
            dataInitializer.run();
            return ResponseUtil.success("预置数据操作已执行，请查看日志确认结果");
        } catch (Exception e) {
            log.error("手动预置数据失败", e);
            return ResponseUtil.error("预置失败: " + e.getMessage());
        }
    }
}
