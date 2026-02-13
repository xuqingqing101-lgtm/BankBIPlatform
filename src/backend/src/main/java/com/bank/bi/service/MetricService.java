package com.bank.bi.service;

import com.bank.bi.model.entity.data.Metric;
import com.bank.bi.repository.data.MetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MetricService {

    private final MetricRepository metricRepository;

    public List<Metric> getUserMetrics(Long userId) {
        return metricRepository.findByUserId(java.util.Objects.requireNonNull(userId));
    }

    @Transactional
    public Metric createMetric(Metric metric) {
        metric.setCreatedTime(LocalDateTime.now());
        return metricRepository.save(metric);
    }

    @Transactional
    public void deleteMetric(Long id) {
        metricRepository.deleteById(java.util.Objects.requireNonNull(id));
    }
}
