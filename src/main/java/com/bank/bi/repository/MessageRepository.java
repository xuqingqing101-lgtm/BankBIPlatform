package com.bank.bi.repository;

import com.bank.bi.model.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 消息数据访问层
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    /**
     * 根据对话ID查找所有消息（按时间升序）
     */
    List<Message> findByConversationIdOrderByCreatedTimeAsc(Long conversationId);
    
    /**
     * 根据对话ID分页查找消息
     */
    Page<Message> findByConversationIdOrderByCreatedTimeDesc(Long conversationId, Pageable pageable);
    
    /**
     * 统计对话的消息数量
     */
    long countByConversationId(Long conversationId);
}
