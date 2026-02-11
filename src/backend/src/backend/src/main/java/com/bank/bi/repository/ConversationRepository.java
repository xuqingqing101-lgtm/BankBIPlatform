package com.bank.bi.repository;

import com.bank.bi.model.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 对话数据访问层
 */
@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    /**
     * 根据SessionID查找对话
     */
    Optional<Conversation> findBySessionId(String sessionId);
    
    /**
     * 根据用户ID查找所有对话
     */
    List<Conversation> findByUserIdOrderByStartedTimeDesc(Long userId);
    
    /**
     * 根据用户ID和模块查找对话
     */
    List<Conversation> findByUserIdAndModuleOrderByStartedTimeDesc(Long userId, String module);
}
