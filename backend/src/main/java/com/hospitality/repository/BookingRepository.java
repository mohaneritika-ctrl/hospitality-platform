package com.hospitality.repository;

import com.hospitality.entity.Booking;
import com.hospitality.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.bookingStatus = com.hospitality.entity.BookingStatus.CONFIRMED " +
           "AND (:checkInDate < b.checkOutDate AND :checkOutDate > b.checkInDate)")
    Long countOverlappingBookings(@Param("roomId") Long roomId,
                                  @Param("checkInDate") LocalDate checkInDate,
                                  @Param("checkOutDate") LocalDate checkOutDate);

    long countByBookingStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0.0) FROM Booking b WHERE b.bookingStatus = com.hospitality.entity.BookingStatus.CONFIRMED")
    Double calculateTotalRevenue();
}
