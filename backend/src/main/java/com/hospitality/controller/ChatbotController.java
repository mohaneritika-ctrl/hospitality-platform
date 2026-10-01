package com.hospitality.controller;

import com.hospitality.dto.ChatMessageDto;
import com.hospitality.dto.ChatbotRequest;
import com.hospitality.dto.ChatbotResponse;
import com.hospitality.service.ChatbotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/message")
    public ResponseEntity<ChatbotResponse> sendMessage(
            @Valid @RequestBody ChatbotRequest request,
            Authentication authentication) {
        String userEmail = (authentication != null) ? authentication.getName() : null;
        ChatbotResponse response = chatbotService.processMessage(userEmail, request.getMessage());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageDto>> getHistory(Authentication authentication) {
        String userEmail = (authentication != null) ? authentication.getName() : null;
        return ResponseEntity.ok(chatbotService.getUserHistory(userEmail));
    }
}
