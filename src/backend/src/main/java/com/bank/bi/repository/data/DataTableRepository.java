package com.bank.bi.repository.data;

import com.bank.bi.model.entity.data.DataTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataTableRepository extends JpaRepository<DataTable, Long> {
}
