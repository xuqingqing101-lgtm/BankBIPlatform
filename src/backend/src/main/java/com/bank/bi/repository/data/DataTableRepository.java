package com.bank.bi.repository.data;

import com.bank.bi.model.entity.data.DataTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DataTableRepository extends JpaRepository<DataTable, Long> {
    List<DataTable> findByUserId(Long userId);
    boolean existsByDisplayName(String displayName);
    Optional<DataTable> findByTableName(String tableName);
}
