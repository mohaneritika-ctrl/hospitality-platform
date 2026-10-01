package com.hospitality.repository;

import com.hospitality.entity.ChatbotMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatbotMessageRepository extends JpaRepository<ChatbotMessage, Long> {
    List<ChatbotMessage> findByUserIdOrderByCreatedAtAsc(Long userId);
    List<ChatbotMessage> findTop50ByUserIdOrderByCreatedAtAsc(Long userId);
}
