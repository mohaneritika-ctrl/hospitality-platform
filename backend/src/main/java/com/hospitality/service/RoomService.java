package com.hospitality.service;

import com.hospitality.dto.RoomRequest;
import com.hospitality.dto.RoomResponse;
import com.hospitality.entity.Hotel;
import com.hospitality.entity.Room;
import com.hospitality.exception.DuplicateResourceException;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.HotelRepository;
import com.hospitality.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final HotelService hotelService;

    public RoomService(RoomRepository roomRepository, HotelRepository hotelRepository, HotelService hotelService) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
        this.hotelService = hotelService;
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getRoomsByHotelId(Long hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found with id: " + hotelId);
        }
        return roomRepository.findByHotelId(hotelId).stream()
                .map(hotelService::mapRoomToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getAvailableRoomsByHotelId(Long hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found with id: " + hotelId);
        }
        return roomRepository.findByHotelIdAndAvailableTrue(hotelId).stream()
                .map(hotelService::mapRoomToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return hotelService.mapRoomToResponse(room);
    }

    @Transactional
    public RoomResponse createRoom(Long hotelId, RoomRequest request) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));

        if (roomRepository.existsByHotelIdAndRoomNumber(hotelId, request.getRoomNumber().trim())) {
            throw new DuplicateResourceException("Room number " + request.getRoomNumber() + " already exists in this hotel");
        }

        Room room = new Room(
                hotel,
                request.getRoomNumber().trim(),
                request.getRoomType(),
                request.getPricePerNight(),
                request.getCapacity(),
                request.getAvailable() != null ? request.getAvailable() : true,
                request.getDescription()
        );

        Room saved = roomRepository.save(room);
        return hotelService.mapRoomToResponse(saved);
    }

    @Transactional
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        if (request.getRoomNumber() != null && !request.getRoomNumber().trim().equalsIgnoreCase(room.getRoomNumber())) {
            if (roomRepository.existsByHotelIdAndRoomNumber(room.getHotel().getId(), request.getRoomNumber().trim())) {
                throw new DuplicateResourceException("Room number " + request.getRoomNumber() + " already exists in this hotel");
            }
            room.setRoomNumber(request.getRoomNumber().trim());
        }

        if (request.getRoomType() != null) {
            room.setRoomType(request.getRoomType());
        }
        if (request.getPricePerNight() != null) {
            room.setPricePerNight(request.getPricePerNight());
        }
        if (request.getCapacity() != null) {
            room.setCapacity(request.getCapacity());
        }
        if (request.getAvailable() != null) {
            room.setAvailable(request.getAvailable());
        }
        if (request.getDescription() != null) {
            room.setDescription(request.getDescription());
        }

        Room updated = roomRepository.save(room);
        return hotelService.mapRoomToResponse(updated);
    }

    @Transactional
    public RoomResponse toggleAvailability(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        room.setAvailable(!room.getAvailable());
        Room updated = roomRepository.save(room);
        return hotelService.mapRoomToResponse(updated);
    }

    @Transactional
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        roomRepository.delete(room);
    }
}
