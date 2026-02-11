package com.bank.bi.controller;

import com.bank.bi.model.entity.data.Metric;
import com.bank.bi.service.MetricService;
import com.bank.bi.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/metrics")
@RequiredArgsConstructor
public class MetricController {

    private final MetricService metricService;

    @GetMapping
    public ResponseUtil.Result<List<Metric>> getMetrics(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseUtil.success(metricService.getUserMetrics(userId));
    }

    @PostMapping
    public ResponseUtil.Result<Metric> createMetric(@RequestBody Metric metric, HttpServletRequest request) {
        Long userId = getUserId(request);
        metric.setUserId(userId);
        return ResponseUtil.success(metricService.createMetric(metric));
    }

    @DeleteMapping("/{id}")
    public ResponseUtil.Result<Void> deleteMetric(@PathVariable Long id) {
        metricService.deleteMetric(id);
        return ResponseUtil.success(null);
    }

    private Long getUserId(HttpServletRequest request) {
        String headerId = request.getHeader("X-User-Id");
        if (headerId != null) {
            try {
                return Long.parseLong(headerId);
            } catch (NumberFormatException e) {
                // ignore
            }
        }
        return 1L;
    }
}
