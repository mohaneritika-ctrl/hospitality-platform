package com.hospitality.service;

import com.hospitality.dto.BookingRequest;
import com.hospitality.dto.BookingResponse;
import com.hospitality.entity.Booking;
import com.hospitality.entity.BookingStatus;
import com.hospitality.entity.Role;
import com.hospitality.entity.Room;
import com.hospitality.entity.User;
import com.hospitality.exception.BookingException;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.exception.UnauthorizedException;
import com.hospitality.repository.BookingRepository;
import com.hospitality.repository.RoomRepository;
import com.hospitality.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          RoomRepository roomRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        if (Boolean.FALSE.equals(room.getAvailable())) {
            throw new BookingException("Room " + room.getRoomNumber() + " is currently unavailable for booking");
        }

        LocalDate today = LocalDate.now();
        if (request.getCheckInDate().isBefore(today)) {
            throw new BookingException("Check-in date cannot be in the past");
        }

        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BookingException("Check-out date must be strictly after check-in date");
        }

        if (request.getNumberOfGuests() > room.getCapacity()) {
            throw new BookingException("Number of guests (" + request.getNumberOfGuests() +
                    ") exceeds room capacity (" + room.getCapacity() + ")");
        }

        // Prevent Double Booking: check overlapping confirmed bookings
        Long overlappingCount = bookingRepository.countOverlappingBookings(
                room.getId(),
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        if (overlappingCount != null && overlappingCount > 0) {
            throw new BookingException("Room " + room.getRoomNumber() +
                    " is already booked for the selected dates. Please choose different dates or another room.");
        }

        long numberOfNights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (numberOfNights < 1) {
            numberOfNights = 1;
        }

        double totalAmount = numberOfNights * room.getPricePerNight();

        Booking booking = new Booking(
                user,
                room,
                request.getCheckInDate(),
                request.getCheckOutDate(),
                request.getNumberOfGuests(),
                totalAmount,
                BookingStatus.CONFIRMED
        );

        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedException("You are not authorized to view this booking");
        }

        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedException("You are not authorized to cancel this booking");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BookingException("Booking #" + id + " is already cancelled");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());

        if (booking.getUser() != null) {
            response.setUserId(booking.getUser().getId());
            response.setUserName(booking.getUser().getName());
            response.setUserEmail(booking.getUser().getEmail());
        }

        if (booking.getRoom() != null) {
            Room room = booking.getRoom();
            response.setRoomId(room.getId());
            response.setRoomNumber(room.getRoomNumber());
            response.setRoomType(room.getRoomType());
            response.setPricePerNight(room.getPricePerNight());

            if (room.getHotel() != null) {
                response.setHotelId(room.getHotel().getId());
                response.setHotelName(room.getHotel().getName());
                response.setHotelCity(room.getHotel().getCity());
                response.setHotelImageUrl(room.getHotel().getImageUrl());
            }
        }

        response.setCheckInDate(booking.getCheckInDate());
        response.setCheckOutDate(booking.getCheckOutDate());
        response.setNumberOfGuests(booking.getNumberOfGuests());

        long nights = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
        response.setNumberOfNights(nights > 0 ? nights : 1);

        response.setTotalAmount(booking.getTotalAmount());
        response.setBookingStatus(booking.getBookingStatus());
        response.setCreatedAt(booking.getCreatedAt());

        return response;
    }
}
