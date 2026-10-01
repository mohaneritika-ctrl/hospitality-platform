package com.hospitality.service;

import com.hospitality.dto.AdminStatsResponse;
import com.hospitality.entity.BookingStatus;
import com.hospitality.repository.BookingRepository;
import com.hospitality.repository.HotelRepository;
import com.hospitality.repository.RoomRepository;
import com.hospitality.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public AdminService(UserRepository userRepository,
                        HotelRepository hotelRepository,
                        RoomRepository roomRepository,
                        BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getStatistics() {
        long totalUsers = userRepository.count();
        long totalHotels = hotelRepository.count();
        long totalRooms = roomRepository.count();
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository.countByBookingStatus(BookingStatus.CONFIRMED);
        long cancelledBookings = bookingRepository.countByBookingStatus(BookingStatus.CANCELLED);
        Double totalRevenue = bookingRepository.calculateTotalRevenue();

        return new AdminStatsResponse(
                totalUsers,
                totalHotels,
                totalRooms,
                totalBookings,
                confirmedBookings,
                cancelledBookings,
                totalRevenue != null ? totalRevenue : 0.0
        );
    }
}
