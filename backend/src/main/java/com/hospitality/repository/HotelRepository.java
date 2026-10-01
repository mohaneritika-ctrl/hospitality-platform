package com.hospitality.repository;

import com.hospitality.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    Optional<Hotel> findByName(String name);
    boolean existsByName(String name);
    List<Hotel> findByCityIgnoreCase(String city);
    List<Hotel> findByNameContainingIgnoreCase(String name);
}
