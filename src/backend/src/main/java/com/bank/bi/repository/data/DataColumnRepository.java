package com.bank.bi.repository.data;

import com.bank.bi.model.entity.data.DataColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataColumnRepository extends JpaRepository<DataColumn, Long> {
}
