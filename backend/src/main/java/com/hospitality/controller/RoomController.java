package com.hospitality.controller;

import com.hospitality.dto.RoomRequest;
import com.hospitality.dto.RoomResponse;
import com.hospitality.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/api/hotels/{hotelId}/rooms")
    public ResponseEntity<List<RoomResponse>> getRoomsByHotel(
            @PathVariable Long hotelId,
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly) {
        if (availableOnly) {
            return ResponseEntity.ok(roomService.getAvailableRoomsByHotelId(hotelId));
        }
        return ResponseEntity.ok(roomService.getRoomsByHotelId(hotelId));
    }

    @PostMapping("/api/hotels/{hotelId}/rooms")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponse> createRoom(
            @PathVariable Long hotelId,
            @Valid @RequestBody RoomRequest request) {
        RoomResponse response = roomService.createRoom(hotelId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/api/rooms/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PutMapping("/api/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    @PatchMapping("/api/rooms/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponse> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.toggleAvailability(id));
    }

    @DeleteMapping("/api/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
