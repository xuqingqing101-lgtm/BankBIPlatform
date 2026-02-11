package com.bank.bi.repository.data;

import com.bank.bi.model.entity.data.DataTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DataTableRepository extends JpaRepository<DataTable, Long> {
    List<DataTable> findByUserId(Long userId);
    boolean existsByDisplayName(String displayName);
}
