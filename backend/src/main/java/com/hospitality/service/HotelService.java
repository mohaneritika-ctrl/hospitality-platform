package com.hospitality.service;

import com.hospitality.dto.HotelRequest;
import com.hospitality.dto.HotelResponse;
import com.hospitality.dto.RoomResponse;
import com.hospitality.entity.Hotel;
import com.hospitality.entity.Room;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.HotelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Transactional(readOnly = true)
    public List<HotelResponse> getAllHotels() {
        return hotelRepository.findAll().stream()
                .map(h -> mapToResponse(h, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HotelResponse getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        return mapToResponse(hotel, true);
    }

    @Transactional(readOnly = true)
    public List<HotelResponse> searchHotels(String city, String name, String state, Double minRating, Double minPrice, Double maxPrice, String sortBy) {
        List<Hotel> hotels = hotelRepository.findAll();

        return hotels.stream()
                .filter(h -> {
                    if (city != null && !city.isBlank()) {
                        if (h.getCity() == null || !h.getCity().toLowerCase().contains(city.trim().toLowerCase())) {
                            return false;
                        }
                    }
                    if (name != null && !name.isBlank()) {
                        if (h.getName() == null || !h.getName().toLowerCase().contains(name.trim().toLowerCase())) {
                            return false;
                        }
                    }
                    if (state != null && !state.isBlank()) {
                        if (h.getState() == null || !h.getState().toLowerCase().contains(state.trim().toLowerCase())) {
                            return false;
                        }
                    }
                    if (minRating != null) {
                        if (h.getRating() == null || h.getRating() < minRating) {
                            return false;
                        }
                    }
                    if (minPrice != null || maxPrice != null) {
                        if (h.getRooms() != null && !h.getRooms().isEmpty()) {
                            boolean hasMatchingRoom = h.getRooms().stream().anyMatch(r -> {
                                if (minPrice != null && r.getPricePerNight() < minPrice) return false;
                                if (maxPrice != null && r.getPricePerNight() > maxPrice) return false;
                                return true;
                            });
                            if (!hasMatchingRoom) return false;
                        }
                    }
                    return true;
                })
                .map(h -> mapToResponse(h, false))
                .sorted((a, b) -> {
                    if ("price_asc".equalsIgnoreCase(sortBy)) {
                        return Comparator.comparing(HotelResponse::getStartingPrice, Comparator.nullsLast(Double::compareTo)).compare(a, b);
                    } else if ("price_desc".equalsIgnoreCase(sortBy)) {
                        return Comparator.comparing(HotelResponse::getStartingPrice, Comparator.nullsFirst(Double::compareTo)).reversed().compare(a, b);
                    } else {
                        // Default rating descending
                        return Comparator.comparing(HotelResponse::getRating, Comparator.nullsFirst(Double::compareTo)).reversed().compare(a, b);
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public HotelResponse createHotel(HotelRequest request) {
        Hotel hotel = new Hotel(
                request.getName().trim(),
                request.getDescription(),
                request.getAddress().trim(),
                request.getCity().trim(),
                request.getState(),
                request.getCountry() != null ? request.getCountry() : "India",
                request.getRating(),
                request.getImageUrl()
        );
        Hotel saved = hotelRepository.save(hotel);
        return mapToResponse(saved, false);
    }

    @Transactional
    public HotelResponse updateHotel(Long id, HotelRequest request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        hotel.setName(request.getName().trim());
        hotel.setDescription(request.getDescription());
        hotel.setAddress(request.getAddress().trim());
        hotel.setCity(request.getCity().trim());
        hotel.setState(request.getState());
        hotel.setCountry(request.getCountry());
        hotel.setRating(request.getRating());
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            hotel.setImageUrl(request.getImageUrl());
        }

        Hotel updated = hotelRepository.save(hotel);
        return mapToResponse(updated, true);
    }

    @Transactional
    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        hotelRepository.delete(hotel);
    }

    public HotelResponse mapToResponse(Hotel hotel, boolean includeRooms) {
        HotelResponse response = new HotelResponse();
        response.setId(hotel.getId());
        response.setName(hotel.getName());
        response.setDescription(hotel.getDescription());
        response.setAddress(hotel.getAddress());
        response.setCity(hotel.getCity());
        response.setState(hotel.getState());
        response.setCountry(hotel.getCountry());
        response.setRating(hotel.getRating());
        response.setImageUrl(hotel.getImageUrl());
        response.setCreatedAt(hotel.getCreatedAt());

        if (hotel.getRooms() != null && !hotel.getRooms().isEmpty()) {
            response.setTotalRooms(hotel.getRooms().size());
            Double minPrice = hotel.getRooms().stream()
                    .filter(Room::getAvailable)
                    .map(Room::getPricePerNight)
                    .min(Double::compareTo)
                    .orElse(hotel.getRooms().stream().map(Room::getPricePerNight).min(Double::compareTo).orElse(0.0));
            response.setStartingPrice(minPrice);

            if (includeRooms) {
                List<RoomResponse> roomResponses = hotel.getRooms().stream()
                        .map(this::mapRoomToResponse)
                        .collect(Collectors.toList());
                response.setRooms(roomResponses);
            }
        } else {
            response.setTotalRooms(0);
            response.setStartingPrice(0.0);
        }

        return response;
    }

    public RoomResponse mapRoomToResponse(Room room) {
        RoomResponse response = new RoomResponse();
        response.setId(room.getId());
        response.setHotelId(room.getHotel() != null ? room.getHotel().getId() : null);
        response.setHotelName(room.getHotel() != null ? room.getHotel().getName() : null);
        response.setRoomNumber(room.getRoomNumber());
        response.setRoomType(room.getRoomType());
        response.setPricePerNight(room.getPricePerNight());
        response.setCapacity(room.getCapacity());
        response.setAvailable(room.getAvailable());
        response.setDescription(room.getDescription());
        return response;
    }
}
