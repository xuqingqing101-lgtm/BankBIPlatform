package com.bank.bi.repository.data;

import com.bank.bi.model.entity.data.Metric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetricRepository extends JpaRepository<Metric, Long> {
    List<Metric> findByUserId(Long userId);
}
