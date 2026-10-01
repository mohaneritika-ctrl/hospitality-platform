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

        logger.info("Verifying and seeding realistic demo hotels and rooms...");
        seedAllHotelsAndRooms();
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

    private record RoomSeed(String roomNumber, RoomType roomType, Double price, Integer capacity, String description) {}

    private void seedHotelWithRooms(
            String name, String description, String address, String city,
            String state, String country, Double rating, String imageUrl,
            String amenities, String hotelType,
            RoomSeed r1, RoomSeed r2, RoomSeed r3) {

        Hotel hotel = hotelRepository.findByName(name).orElse(null);
        if (hotel == null) {
            hotel = new Hotel(name, description, address, city, state, country, rating, imageUrl, amenities, hotelType);
            hotel = hotelRepository.save(hotel);
            logger.info("Created demo hotel: {}", name);
        } else {
            hotel.setDescription(description);
            hotel.setAddress(address);
            hotel.setCity(city);
            hotel.setState(state);
            hotel.setCountry(country);
            hotel.setRating(rating);
            hotel.setImageUrl(imageUrl);
            hotel.setAmenities(amenities);
            hotel.setHotelType(hotelType);
            hotel = hotelRepository.save(hotel);
            logger.info("Updated existing hotel metadata: {}", name);
        }

        List<Room> existingRooms = roomRepository.findByHotelId(hotel.getId());
        if (existingRooms.isEmpty()) {
            Room room1 = new Room(hotel, r1.roomNumber, r1.roomType, r1.price, r1.capacity, true, r1.description);
            Room room2 = new Room(hotel, r2.roomNumber, r2.roomType, r2.price, r2.capacity, true, r2.description);
            Room room3 = new Room(hotel, r3.roomNumber, r3.roomType, r3.price, r3.capacity, true, r3.description);
            roomRepository.saveAll(List.of(room1, room2, room3));
            logger.info("Seeded 3 rooms for {}", name);
        }
    }

    private void seedAllHotelsAndRooms() {
        // 1. Pune - The Grand Heritage Pune
        seedHotelWithRooms(
                "The Grand Heritage Pune",
                "An exquisite luxury property blending colonial elegance with contemporary comforts. Featuring lush landscaped courtyards, award-winning fine dining, and serene spa therapies in the heart of Pune.",
                "Senapati Bapat Road, Shivajinagar",
                "Pune", "Maharashtra", "India", 4.8,
                "/assets/hotels/pune-hotel-1.jpg",
                "Free High-Speed Wi-Fi, Outdoor Swimming Pool, Multi-Cuisine Fine Dining, Luxury Ayurvedic Spa, Fitness Center, 24/7 Room Service, Valet Parking",
                "LUXURY",
                new RoomSeed("101", RoomType.STANDARD, 2800.0, 2, "Cozy room with courtyard view, high-speed Wi-Fi, queen bed, and modern ensuite bathroom."),
                new RoomSeed("201", RoomType.DELUXE, 4500.0, 3, "Spacious premium room with balcony, king-sized bed, bathtub, and complimentary morning breakfast."),
                new RoomSeed("301", RoomType.SUITE, 8200.0, 4, "Grand executive suite with separate master lounge, whirlpool bath, panoramic city skyline view, and butler service.")
        );

        // 2. Pune - Koregaon Forest Eco Resort
        seedHotelWithRooms(
                "Koregaon Forest Eco Resort",
                "A serene eco-friendly urban resort nestled amidst the lush green canopies of Koregaon Park, offering organic culinary dining, open-air cabanas, and peaceful nature trails.",
                "Koregaon Park Lane 7",
                "Pune", "Maharashtra", "India", 4.7,
                "/assets/hotels/pune-hotel-2.jpg",
                "Swimming Pool, Organic Garden Cafe, Yoga Pavilion, Free High-Speed Wi-Fi, Pet Friendly, Bicycle Rentals, EV Charging",
                "RESORT",
                new RoomSeed("KP-101", RoomType.STANDARD, 3200.0, 2, "Tranquil garden-facing room with private patio, timber furnishings, and organic herbal amenities."),
                new RoomSeed("KP-201", RoomType.DELUXE, 5100.0, 3, "Eco-deluxe cottage with rain shower, open terrace lounge, and artisan breakfast."),
                new RoomSeed("KP-401", RoomType.SUITE, 9400.0, 4, "Canopy luxury treehouse suite with panoramic forest view, private jacuzzi, and personalized yoga master.")
        );

        // 3. Mumbai - Marine Bay Luxury Hotel & Suites
        seedHotelWithRooms(
                "Marine Bay Luxury Hotel & Suites",
                "Iconic oceanfront oasis overlooking the Arabian Sea and Queen's Necklace. Indulge in infinity rooftop pools, signature sea-view restaurants, and world-class hospitality.",
                "Marine Drive, Nariman Point",
                "Mumbai", "Maharashtra", "India", 4.9,
                "/assets/hotels/mumbai-hotel-1.jpg",
                "Arabian Sea View, Infinity Rooftop Pool, Michelin-Star Dining, Luxury Wellness Spa, Valet Parking, Airport Limousine, High-Speed Wi-Fi",
                "LUXURY",
                new RoomSeed("M-102", RoomType.STANDARD, 3800.0, 2, "Chic urban standard room with sea breeze ventilation, soundproof glazing, and espresso machine."),
                new RoomSeed("M-205", RoomType.DELUXE, 6200.0, 3, "Direct sea-facing deluxe room with floor-to-ceiling glass windows, king plush bed, and rainfall shower."),
                new RoomSeed("M-501", RoomType.SUITE, 12500.0, 4, "Royal Arabian Suite featuring wrap-around balcony, private dining area, marble whirlpool spa, and champagne on arrival.")
        );

        // 4. Mumbai - The Colaba Boutique Inn
        seedHotelWithRooms(
                "The Colaba Boutique Inn",
                "A charming heritage boutique hotel situated minutes away from the Gateway of India, combining Victorian architecture with contemporary artistic interiors.",
                "Colaba Causeway, Near Gateway of India",
                "Mumbai", "Maharashtra", "India", 4.6,
                "/assets/hotels/mumbai-hotel-2.jpg",
                "Artisanal Coffee Bar, Rooftop Bistro, High-Speed Wi-Fi, Curated Art Gallery, Concierge Tour Desk, Air Conditioning",
                "BOUTIQUE",
                new RoomSeed("C-101", RoomType.STANDARD, 3400.0, 2, "Artistic boutique standard room with retro decor, plush queen bed, and specialty coffee maker."),
                new RoomSeed("C-202", RoomType.DELUXE, 5600.0, 3, "Colaba heritage deluxe room with antique teakwood balcony, bespoke furniture, and soaking tub."),
                new RoomSeed("C-303", RoomType.SUITE, 9800.0, 4, "The Governor's Suite featuring vintage collectibles, high ceilings, library lounge, and harbor views.")
        );

        // 5. Goa - Azure Palms Beachfront Resort
        seedHotelWithRooms(
                "Azure Palms Beachfront Resort",
                "Tropical paradise situated right on the golden sands of Candolim. Offering private cabanas, watersports concierge, open-air beach shacks, and sun-kissed sunset lounges.",
                "Candolim Beach Road, North Goa",
                "Goa", "Goa", "India", 4.7,
                "/assets/hotels/goa-hotel-1.jpg",
                "Direct Beach Access, Beachfront Shacks, Lagoon Pool, Watersports Desk, Ayurvedic Spa, Sunset Cocktails Lounge, Free Wi-Fi",
                "RESORT",
                new RoomSeed("G-11", RoomType.STANDARD, 3200.0, 2, "Bright coastal style standard room steps away from pool gardens with outdoor sit-out."),
                new RoomSeed("G-24", RoomType.DELUXE, 5400.0, 3, "Garden cottage room with private deck, open-air shower, king bed, and hammock."),
                new RoomSeed("G-V1", RoomType.SUITE, 9800.0, 4, "Exclusive beachfront villa suite with private plunge pool, direct beach pathway, and dedicated butler.")
        );

        // 6. Goa - The Portuguese Manor Heritage Villa
        seedHotelWithRooms(
                "The Portuguese Manor Heritage Villa",
                "A lovingly restored 19th-century Portuguese manor nestled in Fontainhas, boasting handcrafted azulejo tiles, antique mahogany furniture, and tranquil garden courtyards.",
                "Fontainhas Latin Quarter, Panaji",
                "Goa", "Goa", "India", 4.8,
                "/assets/hotels/goa-hotel-2.jpg",
                "Heritage Courtyard Pool, Portuguese Tavern, Free High-Speed Wi-Fi, Cultural Walking Tours, Vintage Library, Free Breakfast",
                "HERITAGE",
                new RoomSeed("PM-1", RoomType.STANDARD, 3600.0, 2, "Classic Latin Quarter room with arched windows, Portuguese ceramic tiles, and queen feather bed."),
                new RoomSeed("PM-2", RoomType.DELUXE, 5800.0, 3, "Heritage manor deluxe room overlooking cobblestone courtyards, four-poster bed, and cast-iron bath."),
                new RoomSeed("PM-S", RoomType.SUITE, 10500.0, 4, "The Viceroy Presidential Suite with original baroque frescoes, private veranda, and evening port wine service.")
        );

        // 7. Jaipur - Royal Haveli Palace & Spa
        seedHotelWithRooms(
                "Royal Haveli Palace & Spa",
                "A majestic Rajasthani palace sanctuary featuring hand-carved jharokhas, mirror-mosaic courtyards, royal puppet performances, and authentic royal Mewari cuisine.",
                "Amber Fort Road, Amer",
                "Jaipur", "Rajasthan", "India", 4.9,
                "/assets/hotels/jaipur-hotel-1.jpg",
                "Palace Courtyards, Royal Spa & Hammam, Traditional Rajasthani Folk Evenings, Fine Dining, Free Wi-Fi, Heritage Pool",
                "HERITAGE",
                new RoomSeed("J-101", RoomType.STANDARD, 3500.0, 2, "Traditional Rajput standard room with block-print textiles, marble floor, and quiet courtyard view."),
                new RoomSeed("J-202", RoomType.DELUXE, 6000.0, 3, "Royal Haveli deluxe chamber with intricately painted ceilings, king bed, and clawfoot bathtub."),
                new RoomSeed("J-401", RoomType.SUITE, 11800.0, 4, "Maharaja Royal Suite with arched bay windows, private terrace facing Amber hills, and royal thali dinner.")
        );

        // 8. Jaipur - Amber Fort View Grand
        seedHotelWithRooms(
                "Amber Fort View Grand",
                "A sophisticated blend of Rajasthani architectural grandeur and contemporary 5-star luxury located in the heart of Jaipur's prime shopping district.",
                "MI Road, C-Scheme",
                "Jaipur", "Rajasthan", "India", 4.7,
                "/assets/hotels/jaipur-hotel-2.jpg",
                "Rooftop Pool, Pan-Asian & Indian Dining, Banquet Hall, Fitness Center, Free Wi-Fi, Valet Parking",
                "LUXURY",
                new RoomSeed("AF-101", RoomType.STANDARD, 3100.0, 2, "Smart urban luxury room with marble ensuite, high-speed Wi-Fi, and plush bedding."),
                new RoomSeed("AF-202", RoomType.DELUXE, 5200.0, 3, "Fort-facing deluxe room featuring panoramic pink city views, rain shower, and breakfast buffet."),
                new RoomSeed("AF-501", RoomType.SUITE, 9200.0, 4, "Grand Pink City Suite with expansive living room, jacuzzi tub, and complimentary airport transfers.")
        );

        // 9. Udaipur - Lake Pichola Lakeview Grand Palace
        seedHotelWithRooms(
                "Lake Pichola Lakeview Grand Palace",
                "An enchanting waterfront jewel directly overlooking shimmering Lake Pichola and the City Palace. Experience sunset boat cruises and candlelit lakeside dining under the stars.",
                "Pichola Lake Promenade",
                "Udaipur", "Rajasthan", "India", 4.9,
                "/assets/hotels/udaipur-hotel-1.jpg",
                "Lake View Dining, Private Boat Charters, Royal Wellness Spa, Infinity Lake Pool, Free Wi-Fi, Concierge",
                "HERITAGE",
                new RoomSeed("U-101", RoomType.STANDARD, 4200.0, 2, "Elegant palace-wing standard room with marble jali screens, ornate carvings, and queen bed."),
                new RoomSeed("U-202", RoomType.DELUXE, 7500.0, 3, "Direct Lakeview deluxe room with jharokha seating overlooking the water, king bed, and sunken tub."),
                new RoomSeed("U-501", RoomType.SUITE, 14000.0, 4, "Imperial Lake Palace Suite with private lakeside terrace, marble jacuzzi, and personal royal butler.")
        );

        // 10. Manali - Himalayan Alpine Mist Resort
        seedHotelWithRooms(
                "Himalayan Alpine Mist Resort",
                "An idyllic mountain sanctuary surrounded by towering deodar forests and snow-dusted Himalayan peaks. Features cozy cedarwood fireplaces and alpine trekking expeditions.",
                "Naggar Road, Aleo",
                "Manali", "Himachal Pradesh", "India", 4.8,
                "/assets/hotels/manali-hotel-1.jpg",
                "Snow Mountain Views, Cedar Wood Fireplace Lounge, Heated Indoor Pool, Skiing & Trekking Concierge, Mountain Biking, Free Wi-Fi",
                "RESORT",
                new RoomSeed("MN-101", RoomType.STANDARD, 2900.0, 2, "Pine-scented alpine room with private balcony, heater, mountain view, and warm fleece bedding."),
                new RoomSeed("MN-202", RoomType.DELUXE, 4800.0, 3, "Himalayan panoramic deluxe room with wooden fireplace, deep bay window, and organic herbal teas."),
                new RoomSeed("MN-303", RoomType.SUITE, 8900.0, 4, "Snow Peak Chalet Suite with duplex attic, private cedar sauna, glass fireplace, and barbecue deck.")
        );

        // 11. Lonavala - Cloud Nine Hillside Villa & Resort
        seedHotelWithRooms(
                "Cloud Nine Hillside Villa & Resort",
                "Perched majestically on the mist-covered cliffs of Khandala and Lonavala, offering breathtaking valley panoramas, monsoon waterfalls, and secluded luxury villas.",
                "Tiger Point Road, Khandala",
                "Lonavala", "Maharashtra", "India", 4.6,
                "/assets/hotels/lonavala-hotel-1.jpg",
                "Cliffside Infinity Pool, Waterfall Trekking, Gazebo Dining, Indoor Games Arcade, High-Speed Wi-Fi, Spa",
                "RESORT",
                new RoomSeed("LN-101", RoomType.STANDARD, 2700.0, 2, "Cozy hillside room with valley breeze balcony, queen bed, and coffee maker."),
                new RoomSeed("LN-202", RoomType.DELUXE, 4600.0, 3, "Misty valley deluxe villa room with private garden patio, outdoor hammock, and breakfast."),
                new RoomSeed("LN-303", RoomType.SUITE, 8500.0, 4, "Skyline Cliff Suite with private outdoor plunge tub, panoramic gorge view, and personal chef service.")
        );

        // 12. Nashik - The Vineyard Grand & Spa
        seedHotelWithRooms(
                "The Vineyard Grand & Spa",
                "Nestled amidst rolling vineyards and scenic lakes. Experience tranquil wine tasting tours, curated grape-seed wellness therapies, and quiet countryside retreat vibes.",
                "Gangapur Dam Road",
                "Nashik", "Maharashtra", "India", 4.6,
                "/assets/hotels/nashik-hotel-1.jpg",
                "Vineyard Tours & Wine Tasting, Grape-Seed Wellness Spa, Barrel Dining, Infinity Pool, Free Wi-Fi, Bicycle Tours",
                "RESORT",
                new RoomSeed("V-101", RoomType.STANDARD, 2500.0, 2, "Serene vineyard-view room featuring oak furnishings, queen bed, and artisanal organic teas."),
                new RoomSeed("V-202", RoomType.DELUXE, 4100.0, 3, "Deluxe terrace suite overlooking private vines, complimentary barrel-tasting coupon, and deep soak tub."),
                new RoomSeed("V-303", RoomType.SUITE, 7200.0, 4, "Panoramic hilltop suite with 360-degree lake and vineyard views, fireplace, and gourmet breakfast basket.")
        );

        // 13. Bangalore - Silicon Valley Grand Hotel
        seedHotelWithRooms(
                "Silicon Valley Grand Hotel",
                "A futuristic ultra-modern business sanctuary equipped with smart IoT suites, rooftop craft brewery, wellness studios, and express connectivity to Bangalore tech corridors.",
                "Outer Ring Road, Bellandur",
                "Bangalore", "Karnataka", "India", 4.8,
                "/assets/hotels/bangalore-hotel-1.jpg",
                "500Mbps Fiber Wi-Fi, Smart IoT Room Automation, Rooftop Craft Brewery, Business Center, Ergonomic Workstations, Gym",
                "BUSINESS",
                new RoomSeed("B-401", RoomType.STANDARD, 3100.0, 2, "Ergonomic business room with high-speed 500Mbps fiber Wi-Fi, Herman Miller chair, and smart room automation."),
                new RoomSeed("B-605", RoomType.DELUXE, 4900.0, 3, "Corner executive deluxe room with skyline glass facade, king bed, and executive lounge access."),
                new RoomSeed("B-901", RoomType.SUITE, 8900.0, 4, "Penthouse sky suite with private conference lounge, high-end acoustics, and luxury massage chair.")
        );

        // 14. Hyderabad - Cyber City Grand Landmark
        seedHotelWithRooms(
                "Cyber City Grand Landmark",
                "A premier corporate and lifestyle hotel located in Hyderabad's bustling Hitec City, featuring state-of-the-art conference facilities and legendary Hyderabadi culinary treats.",
                "Hitec City, Madhapur",
                "Hyderabad", "Telangana", "India", 4.7,
                "/assets/hotels/hyderabad-hotel-1.jpg",
                "Executive Business Lounges, Authentic Biryani Kitchen, Temperature-Controlled Pool, Valet Parking, Free High-Speed Wi-Fi, 24/7 Gym",
                "BUSINESS",
                new RoomSeed("HY-101", RoomType.STANDARD, 2900.0, 2, "Modern corporate room with workstation, high-speed Wi-Fi, plush mattress, and power shower."),
                new RoomSeed("HY-202", RoomType.DELUXE, 4700.0, 3, "Executive deluxe room with cyber skyline views, complimentary lounge cocktails, and express laundry."),
                new RoomSeed("HY-401", RoomType.SUITE, 8600.0, 4, "Presidential Hitec Suite with 8-seater conference room, dining hall, jacuzzi, and dedicated chauffeur.")
        );

        // 15. Kerala - Emerald Backwaters Lagoon Resort
        seedHotelWithRooms(
                "Emerald Backwaters Lagoon Resort",
                "An idyllic tropical hideaway on the banks of Punnamada Lake. Immerse yourself in traditional Kerala architecture, authentic Panchakarma wellness treatments, and private houseboat backwater voyages.",
                "Punnamada Lake, Alleppey",
                "Kerala", "Kerala", "India", 4.9,
                "/assets/hotels/kerala-hotel-1.jpg",
                "Private Houseboat Cruises, Ayurvedic Healing Center, Lotus Lagoon Pool, Floating Breakfast, Free Wi-Fi, Canoe Trails",
                "RESORT",
                new RoomSeed("KL-101", RoomType.STANDARD, 3600.0, 2, "Traditional Kerala cottage room with terracotta tiled veranda, open sky bathroom, and palm grove views."),
                new RoomSeed("KL-202", RoomType.DELUXE, 5900.0, 3, "Lakeside luxury cottage with private deck over the lagoon, teakwood king bed, and traditional uruli bath."),
                new RoomSeed("KL-303", RoomType.SUITE, 11200.0, 4, "Royal Floating Villa Suite anchored on private canal with personal boatman, sun deck, and ayurvedic massage on demand.")
        );

        // 16. Agra - Taj Gateway Panorama Hotel
        seedHotelWithRooms(
                "Taj Gateway Panorama Hotel",
                "A magnificent luxury hotel situated moments away from the Taj Mahal. Bask in stunning views of the world wonder from the rooftop infinity deck and dine like Mughal royalty.",
                "Fatehabad Road, Tajganj",
                "Agra", "Uttar Pradesh", "India", 4.8,
                "/assets/hotels/agra-hotel-1.jpg",
                "Taj Mahal View Rooftop, Mughal Fine Dining, Outdoor Swimming Pool, Mughal Gardens, Free Wi-Fi, Heritage Guide Service",
                "LUXURY",
                new RoomSeed("AG-101", RoomType.STANDARD, 3300.0, 2, "Sophisticated standard room with marble inlays, premium bedding, and city garden views."),
                new RoomSeed("AG-202", RoomType.DELUXE, 5500.0, 3, "Taj View deluxe room with unobstructed view of the Taj Mahal dome, king bed, and gourmet confectionery."),
                new RoomSeed("AG-501", RoomType.SUITE, 10800.0, 4, "The Mumtaz Royal Suite with private rooftop terrace overlooking the Taj Mahal, marble bathroom, and champagne dinner.")
        );

        // Seed sample booking if empty
        if (bookingRepository.count() == 0) {
            User rahul = userRepository.findByEmail("rahul@gmail.com").orElse(null);
            Hotel pune = hotelRepository.findByName("The Grand Heritage Pune").orElse(null);
            if (rahul != null && pune != null) {
                List<Room> rooms = roomRepository.findByHotelId(pune.getId());
                if (!rooms.isEmpty()) {
                    Room sampleRoom = rooms.stream().filter(r -> r.getRoomType() == RoomType.DELUXE).findFirst().orElse(rooms.get(0));
                    Booking demoBooking = new Booking(
                            rahul,
                            sampleRoom,
                            LocalDate.now().plusDays(3),
                            LocalDate.now().plusDays(5),
                            2,
                            sampleRoom.getPricePerNight() * 2,
                            BookingStatus.CONFIRMED
                    );
                    bookingRepository.save(demoBooking);
                    logger.info("Seeded initial confirmed booking for rahul@gmail.com in Pune Deluxe room");
                }
            }
        }

        logger.info("Hotel and room seeding complete. Total hotels: {}", hotelRepository.count());
    }
}
