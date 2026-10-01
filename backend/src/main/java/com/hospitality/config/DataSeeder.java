package com.hospitality.config;

import com.hospitality.entity.*;
import com.hospitality.repository.BookingRepository;
import com.hospitality.repository.HotelRepository;
import com.hospitality.repository.RoomRepository;
import com.hospitality.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      HotelRepository hotelRepository,
                      RoomRepository roomRepository,
                      BookingRepository bookingRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            logger.info("Database empty. Seeding initial users...");
            seedUsers();
        }

        if (hotelRepository.count() == 0) {
            logger.info("No hotels found. Seeding luxury hotels and rooms...");
            seedHotelsAndRooms();
        }
    }

    private void seedUsers() {
        User admin = new User(
                "Admin Manager",
                "admin@hospitality.com",
                passwordEncoder.encode("Admin@123"),
                "+91 9876543210",
                Role.ADMIN
        );

        User user1 = new User(
                "Rahul Sharma",
                "rahul@gmail.com",
                passwordEncoder.encode("User@123"),
                "+91 9822011223",
                Role.USER
        );

        User user2 = new User(
                "Priya Patel",
                "priya@gmail.com",
                passwordEncoder.encode("User@123"),
                "+91 9833445566",
                Role.USER
        );

        userRepository.saveAll(List.of(admin, user1, user2));
        logger.info("Successfully seeded Admin (admin@hospitality.com) and Users (rahul@gmail.com, priya@gmail.com)");
    }

    private void seedHotelsAndRooms() {
        // Hotel 1: Pune
        Hotel puneHotel = new Hotel(
                "The Grand Heritage Pune",
                "An exquisite luxury property blending colonial elegance with modern luxury. Featuring lush landscaped courtyards, award-winning fine dining, and serene spa therapies in the heart of Pune.",
                "Senapati Bapat Road, Shivajinagar",
                "Pune",
                "Maharashtra",
                "India",
                4.8,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
        );
        Hotel savedPune = hotelRepository.save(puneHotel);

        Room puneR1 = new Room(savedPune, "101", RoomType.STANDARD, 2800.0, 2, true,
                "Cozy room with courtyard view, high-speed Wi-Fi, queen bed, and modern ensuite bathroom.");
        Room puneR2 = new Room(savedPune, "201", RoomType.DELUXE, 4500.0, 3, true,
                "Spacious premium room with balcony, king-sized bed, bathtub, and complimentary morning breakfast.");
        Room puneR3 = new Room(savedPune, "301", RoomType.SUITE, 8200.0, 4, true,
                "Grand executive suite with separate master lounge, whirlpool bath, panoramic city skyline view, and butler service.");
        roomRepository.saveAll(List.of(puneR1, puneR2, puneR3));

        // Hotel 2: Mumbai
        Hotel mumbaiHotel = new Hotel(
                "Marine Bay Luxury Hotel & Suites",
                "Iconic oceanfront oasis overlooking the Arabian Sea and Queen's Necklace. Indulge in infinity rooftop pools, signature sea-view restaurants, and world-class hospitality.",
                "Marine Drive, Nariman Point",
                "Mumbai",
                "Maharashtra",
                "India",
                4.9,
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
        );
        Hotel savedMumbai = hotelRepository.save(mumbaiHotel);

        Room mumR1 = new Room(savedMumbai, "M-102", RoomType.STANDARD, 3800.0, 2, true,
                "Chic urban standard room with sea breeze ventilation, soundproof glazing, and espresso machine.");
        Room mumR2 = new Room(savedMumbai, "M-205", RoomType.DELUXE, 6200.0, 3, true,
                "Direct sea-facing deluxe room with floor-to-ceiling glass windows, king plush bed, and rainfall shower.");
        Room mumR3 = new Room(savedMumbai, "M-501", RoomType.SUITE, 12500.0, 4, true,
                "Royal Arabian Suite featuring wrap-around balcony, private dining area, marble whirlpool spa, and champagne on arrival.");
        roomRepository.saveAll(List.of(mumR1, mumR2, mumR3));

        // Hotel 3: Goa
        Hotel goaHotel = new Hotel(
                "Azure Palms Beachfront Resort",
                "Tropical paradise situated right on the golden sands of Candolim. Offering private cabanas, watersports concierge, open-air beach shacks, and sun-kissed sunset lounges.",
                "Candolim Beach Road, North Goa",
                "Goa",
                "Goa",
                "India",
                4.7,
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
        );
        Hotel savedGoa = hotelRepository.save(goaHotel);

        Room goaR1 = new Room(savedGoa, "G-11", RoomType.STANDARD, 3200.0, 2, true,
                "Bright coastal style standard room steps away from pool gardens with outdoor sit-out.");
        Room goaR2 = new Room(savedGoa, "G-24", RoomType.DELUXE, 5400.0, 3, true,
                "Garden cottage room with private deck, open-air shower, king bed, and hammock.");
        Room goaR3 = new Room(savedGoa, "G-V1", RoomType.SUITE, 9800.0, 4, true,
                "Exclusive beachfront villa suite with private plunge pool, direct beach pathway, and dedicated butler.");
        roomRepository.saveAll(List.of(goaR1, goaR2, goaR3));

        // Hotel 4: Nashik
        Hotel nashikHotel = new Hotel(
                "The Vineyard Grand & Spa",
                "Nestled amidst rolling vineyards and scenic lakes. Experience tranquil wine tasting tours, curated grape-seed wellness therapies, and quiet countryside retreat vibes.",
                "Gangapur Dam Road",
                "Nashik",
                "Maharashtra",
                "India",
                4.6,
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
        );
        Hotel savedNashik = hotelRepository.save(nashikHotel);

        Room nasR1 = new Room(savedNashik, "V-101", RoomType.STANDARD, 2500.0, 2, true,
                "Serene vineyard-view room featuring oak furnishings, queen bed, and artisanal organic teas.");
        Room nasR2 = new Room(savedNashik, "V-202", RoomType.DELUXE, 4100.0, 3, true,
                "Deluxe terrace suite overlooking private vines, complimentary barrel-tasting coupon, and deep soak tub.");
        Room nasR3 = new Room(savedNashik, "V-303", RoomType.SUITE, 7200.0, 4, true,
                "Panoramic hilltop suite with 360-degree lake and vineyard views, fireplace, and gourmet breakfast basket.");
        roomRepository.saveAll(List.of(nasR1, nasR2, nasR3));

        // Hotel 5: Bangalore
        Hotel blrHotel = new Hotel(
                "Silicon Valley Grand Hotel",
                "A futuristic ultra-modern business sanctuary equipped with smart IoT suites, rooftop craft brewery, wellness studios, and express connectivity to Bangalore tech corridors.",
                "Outer Ring Road, Bellandur",
                "Bangalore",
                "Karnataka",
                "India",
                4.8,
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"
        );
        Hotel savedBlr = hotelRepository.save(blrHotel);

        Room blrR1 = new Room(savedBlr, "B-401", RoomType.STANDARD, 3100.0, 2, true,
                "Ergonomic business room with high-speed 500Mbps fiber Wi-Fi, Herman Miller chair, and smart room automation.");
        Room blrR2 = new Room(savedBlr, "B-605", RoomType.DELUXE, 4900.0, 3, true,
                "Corner executive deluxe room with skyline glass facade, king bed, and lounge access.");
        Room blrR3 = new Room(savedBlr, "B-901", RoomType.SUITE, 8900.0, 4, true,
                "Penthouse sky suite with private conference lounge, high-end acoustics, and luxury massage chair.");
        roomRepository.saveAll(List.of(blrR1, blrR2, blrR3));

        // Seed sample booking for demonstration
        User rahul = userRepository.findByEmail("rahul@gmail.com").orElse(null);
        if (rahul != null) {
            Booking demoBooking = new Booking(
                    rahul,
                    puneR2,
                    LocalDate.now().plusDays(3),
                    LocalDate.now().plusDays(5),
                    2,
                    9000.0,
                    BookingStatus.CONFIRMED
            );
            bookingRepository.save(demoBooking);
            logger.info("Seeded initial confirmed booking for rahul@gmail.com in Pune Deluxe room");
        }

        logger.info("Successfully seeded 5 hotels and 15 rooms across Pune, Mumbai, Goa, Nashik, and Bangalore!");
    }
}
