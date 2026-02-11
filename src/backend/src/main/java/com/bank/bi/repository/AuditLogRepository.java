package com.bank.bi.repository;

import com.bank.bi.model.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserIdOrderByCreatedTimeDesc(Long userId);
    List<AuditLog> findTop100ByOrderByCreatedTimeDesc();
}
