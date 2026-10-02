package com.hospitality.controller;

import com.hospitality.dto.AdminStatsResponse;
import com.hospitality.dto.BookingResponse;
import com.hospitality.dto.UserProfileResponse;
import com.hospitality.service.AdminService;
import com.hospitality.service.BookingService;
import com.hospitality.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final BookingService bookingService;

    public AdminController(AdminService adminService,
                           UserService userService,
                           BookingService bookingService) {
        this.adminService = adminService;
        this.userService = userService;
        this.bookingService = bookingService;
    }

    @GetMapping({"", "/", "/stats", "/statistics"})
    public ResponseEntity<AdminStatsResponse> getStatistics() {
        return ResponseEntity.ok(adminService.getStatistics());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}
