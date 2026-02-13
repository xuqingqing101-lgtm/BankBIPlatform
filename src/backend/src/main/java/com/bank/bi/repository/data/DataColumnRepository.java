package com.bank.bi.repository.data;

import com.bank.bi.model.entity.data.DataColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DataColumnRepository extends JpaRepository<DataColumn, Long> {
    java.util.List<DataColumn> findByDataTableId(Long tableId);
    Optional<DataColumn> findByDataTableIdAndColumnName(Long tableId, String columnName);
    void deleteByDataTableIdAndColumnName(Long tableId, String columnName);
}
