package com.hospitality.dto;

import java.time.LocalDateTime;

public class ChatMessageDto {

    private Long id;
    private String message;
    private String response;
    private LocalDateTime createdAt;

    public ChatMessageDto() {}

    public ChatMessageDto(Long id, String message, String response, LocalDateTime createdAt) {
        this.id = id;
        this.message = message;
        this.response = response;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
