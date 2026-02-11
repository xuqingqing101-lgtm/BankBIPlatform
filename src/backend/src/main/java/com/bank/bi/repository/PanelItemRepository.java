package com.bank.bi.repository;

import com.bank.bi.model.entity.PanelItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PanelItemRepository extends JpaRepository<PanelItem, Long> {
    List<PanelItem> findByPanelId(Long panelId);
}
