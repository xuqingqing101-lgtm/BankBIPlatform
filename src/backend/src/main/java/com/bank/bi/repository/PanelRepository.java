package com.bank.bi.repository;

import com.bank.bi.model.entity.Panel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PanelRepository extends JpaRepository<Panel, Long> {
    List<Panel> findByUserId(Long userId);
    List<Panel> findByType(Panel.PanelType type);
}
