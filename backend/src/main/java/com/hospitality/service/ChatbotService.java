package com.hospitality.service;

import com.hospitality.dto.ChatMessageDto;
import com.hospitality.dto.ChatbotResponse;
import com.hospitality.entity.ChatbotMessage;
import com.hospitality.entity.Hotel;
import com.hospitality.entity.User;
import com.hospitality.repository.ChatbotMessageRepository;
import com.hospitality.repository.HotelRepository;
import com.hospitality.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);

    private final ChatbotMessageRepository chatbotMessageRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.api.key:}")
    private String aiApiKey;

    @Value("${ai.gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    public ChatbotService(ChatbotMessageRepository chatbotMessageRepository,
                          UserRepository userRepository,
                          HotelRepository hotelRepository) {
        this.chatbotMessageRepository = chatbotMessageRepository;
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
    }

    @Transactional
    public ChatbotResponse processMessage(String userEmail, String userMessage) {
        User user = null;
        if (userEmail != null && !userEmail.isBlank()) {
            user = userRepository.findByEmail(userEmail).orElse(null);
        }

        String botResponse = null;

        // Try AI API if key is present
        if (aiApiKey != null && !aiApiKey.isBlank() && !aiApiKey.equalsIgnoreCase("your-local-ai-api-key")) {
            try {
                botResponse = callGeminiApi(userMessage);
            } catch (Exception e) {
                logger.warn("External AI call failed, falling back to local hospitality knowledge engine: {}", e.getMessage());
            }
        }

        // Use smart domain fallback engine if AI is unavailable or failed
        if (botResponse == null || botResponse.isBlank()) {
            botResponse = generateHospitalityResponse(userMessage);
        }

        ChatbotMessage messageRecord = new ChatbotMessage(user, userMessage, botResponse);
        chatbotMessageRepository.save(messageRecord);

        return new ChatbotResponse(botResponse, LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getUserHistory(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return Collections.emptyList();
        }
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return Collections.emptyList();
        }

        return chatbotMessageRepository.findTop50ByUserIdOrderByCreatedAtAsc(user.getId()).stream()
                .map(m -> new ChatMessageDto(m.getId(), m.getMessage(), m.getResponse(), m.getCreatedAt()))
                .collect(Collectors.toList());
    }

    /**
     * Domain-specific hospitality knowledge engine with real-time hotel lookups.
     */
    public String generateHospitalityResponse(String message) {
        String lower = message.toLowerCase().trim();

        // City specific hotel lookups
        for (String city : List.of("pune", "mumbai", "goa", "nashik", "bangalore", "bengaluru", "delhi")) {
            if (lower.contains(city)) {
                String searchCity = city.equals("bengaluru") ? "Bangalore" : city.substring(0, 1).toUpperCase() + city.substring(1);
                List<Hotel> hotels = hotelRepository.findByCityIgnoreCase(searchCity);
                if (!hotels.isEmpty()) {
                    StringBuilder sb = new StringBuilder();
                    sb.append("Here are available hotels in ").append(searchCity).append(":\n");
                    for (Hotel h : hotels) {
                        sb.append("• ").append(h.getName())
                                .append(" (Rating: ").append(h.getRating()).append("★, City: ").append(h.getCity()).append(")\n");
                    }
                    sb.append("\nYou can click 'View Details' on any hotel card to choose your room and book instantly!");
                    return sb.toString();
                } else {
                    return "We currently don't have hotels listed in " + searchCity + 
                           ", but we have fantastic luxury and budget options in Pune, Mumbai, Goa, Nashik, and Bangalore! Check our Hotels page.";
                }
            }
        }

        // Booking process
        if (lower.contains("how can i book") || lower.contains("how to book") || lower.contains("booking process") || lower.contains("make a booking")) {
            return "Booking a room is quick and seamless:\n" +
                    "1. Browse available hotels on the 'Hotels' page or use the search bar.\n" +
                    "2. Click 'View Details' on your desired hotel.\n" +
                    "3. Select a room type (Standard, Deluxe, or Suite).\n" +
                    "4. Pick your Check-in and Check-out dates and guest count.\n" +
                    "5. Review the calculated total price and click 'Confirm Booking'.\n" +
                    "You will immediately receive your booking confirmation!";
        }

        // Cancellation
        if (lower.contains("cancel") || lower.contains("cancellation") || lower.contains("refund")) {
            return "You can easily cancel your booking from the 'My Bookings' section.\n" +
                    "Simply locate your confirmed booking and click 'Cancel Booking'. The status will be updated immediately to CANCELLED with no penalty fees.";
        }

        // Check-in and Check-out times
        if (lower.contains("check-in") || lower.contains("check in") || lower.contains("check out") || lower.contains("checkout") || lower.contains("timing")) {
            return "Standard hotel check-in time is 2:00 PM and check-out time is 11:00 AM.\n" +
                    "Early check-in and late check-out can be requested directly at the hotel front desk subject to room availability.";
        }

        // Room types
        if (lower.contains("room type") || lower.contains("types of room") || lower.contains("standard") || lower.contains("deluxe") || lower.contains("suite")) {
            return "Our hotels offer three comfortable room tiers:\n" +
                    "• STANDARD: Comfortable queen bed, high-speed Wi-Fi, work desk, and ensuite bath (Capacity: 2 guests).\n" +
                    "• DELUXE: Spacious king bed, city or garden views, mini-bar, and premium toiletries (Capacity: 3 guests).\n" +
                    "• SUITE: Luxury master suite with separate living area, bathtub, panoramic balcony, and complimentary breakfast (Capacity: 4 guests).";
        }

        // Price / Cost queries
        if (lower.contains("price") || lower.contains("cost") || lower.contains("rate") || lower.contains("how much") || lower.contains("charge")) {
            return "Room rates vary based on the hotel tier and room type:\n" +
                    "• Standard Rooms start from ₹1,800 to ₹3,200/night.\n" +
                    "• Deluxe Rooms start from ₹3,500 to ₹5,500/night.\n" +
                    "• Luxury Suites start from ₹6,500 to ₹12,000/night.\n" +
                    "Total pricing is dynamically computed based on the exact number of nights you stay.";
        }

        // Contact details
        if (lower.contains("contact") || lower.contains("phone") || lower.contains("email") || lower.contains("support") || lower.contains("helpdesk")) {
            return "You can reach our 24/7 Hospitality Support desk:\n" +
                    "• Email: support@hospitalityplatform.com\n" +
                    "• Phone: +91 (020) 2456-7890\n" +
                    "• Address: Hospitality Platform HQ, Baner, Pune, Maharashtra 411045";
        }

        // Amenities & Services
        if (lower.contains("amenities") || lower.contains("wifi") || lower.contains("breakfast") || lower.contains("pool") || lower.contains("gym") || lower.contains("parking")) {
            return "Most of our partner hotels provide complimentary high-speed Wi-Fi, 24/7 room service, air conditioning, free parking, and access to the swimming pool & fitness center. Check individual hotel details for specific amenities!";
        }

        // Greetings
        if (lower.contains("hello") || lower.contains("hi") || lower.contains("hey") || lower.contains("namaste")) {
            return "Hello! Welcome to Hospitality Platform. I am your AI Concierge.\n" +
                    "I can help you search hotels in cities like Pune or Mumbai, guide you through room booking, check policies, or answer any stay-related questions. How may I assist you today?";
        }

        // Default friendly fallback
        return "I am here to help you with all hotel and stay inquiries! You can ask me:\n" +
                "• 'Which hotels are available in Pune?'\n" +
                "• 'How can I book a room?'\n" +
                "• 'How can I cancel my booking?'\n" +
                "• 'What are the check-in and check-out timings?'\n" +
                "• 'What room types are available?'";
    }

    private String callGeminiApi(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + aiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String systemInstruction = "You are the AI Concierge for Hospitality Platform - Hotel Booking System. " +
                "Help guests with hotel recommendations (Pune, Mumbai, Goa, Bangalore, Nashik), booking instructions, room types (Standard, Deluxe, Suite), " +
                "check-in (2 PM), check-out (11 AM), and cancellation policies. Be polite, concise, and professional.";

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("role", "user", "parts", List.of(Map.of("text", systemInstruction + "\n\nUser Question: " + prompt)))
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map bodyMap = response.getBody();
            List candidates = (List) bodyMap.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map first = (Map) candidates.get(0);
                Map content = (Map) first.get("content");
                if (content != null) {
                    List parts = (List) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        Map firstPart = (Map) parts.get(0);
                        return (String) firstPart.get("text");
                    }
                }
            }
        }
        return null;
    }
}
