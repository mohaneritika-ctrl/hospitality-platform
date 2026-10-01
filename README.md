# Hospitality Platform – Hotel Booking System

## Overview
A full-stack hotel booking platform developed using Java, Spring Boot, PostgreSQL and React.js.

The platform provides a complete end-to-end hotel reservation experience. Guests can discover luxury properties across major cities, inspect room categories, check real-time availability, make bookings with guaranteed double-booking prevention, manage their bookings, and interact with an integrated AI-powered chatbot. Administrators have access to a dedicated dashboard with real-time statistics, hotel and room CRUD management, user supervision, and booking control.

---

## Features

- **User Registration and Login**: Secure account creation with email format validation and duplicate check.
- **JWT-Based Authentication**: Stateless authentication utilizing JSON Web Tokens (HMAC-SHA256) and BCrypt password encryption.
- **User Authorization**: Strict Role-Based Access Control (`ROLE_USER` vs. `ROLE_ADMIN`).
- **Hotel Listing**: Browse curated properties with search, filtering by city, rating, price range, and sorting.
- **Hotel Details**: Detailed view including descriptions, addresses, star ratings, amenities, and available rooms.
- **Room Management**: Room categorization (Standard, Deluxe, Suite) with price per night, guest capacity, and status.
- **Room Availability**: Real-time room status tracking with admin availability toggles.
- **Hotel Booking**: Date selection, real-time night and price calculation, guest counter, and instant reservation confirmation.
- **Double-Booking Prevention**: Mathematical date-overlap verification preventing concurrent conflicting bookings on the same room.
- **My Bookings**: Customer portal to view upcoming/past stays and cancel bookings without cancellation fees.
- **Admin Dashboard**: Visual analytics for total users, hotels, rooms, bookings, confirmed/cancelled counts, and revenue.
- **Hotel Management**: Full CRUD operations (create, view, update, delete hotels).
- **Room Management**: Full CRUD operations for hotel rooms with instant updates.
- **Booking Management**: View all reservations across the system with status filters.
- **AI-Powered Chatbot**: Hospitality assistant answering queries on hotel recommendations, policies, pricing, and check-in/out timings, backed by PostgreSQL history persistence and fallback support.
- **REST APIs**: Modular RESTful endpoints following standard HTTP methods and status codes.
- **PostgreSQL Database**: Relational database with JPA/Hibernate entity relationships and foreign key constraints.
- **Secure Backend Architecture**: Layered design (`controller` -> `service` -> `repository` -> `database`) with centralized `@RestControllerAdvice` exception handling and CORS configuration.

---

## Technologies

- **Backend**:
  - Java 21 (LTS)
  - Spring Boot 3.3.4
  - Spring Security 6
  - JWT (JJWT 0.12.6)
  - Spring Data JPA
  - Hibernate ORM
  - Jakarta Bean Validation
  - Apache Maven 3.9
- **Database**:
  - PostgreSQL 18
  - PostgreSQL JDBC Driver
- **Frontend**:
  - React.js 18
  - Vite 5
  - React Router DOM 6
  - Axios (with Bearer token and 401 interceptors)
  - Lucide React (Icons)
  - Modern Responsive CSS
- **AI / Chatbot**:
  - Google Gemini API (optional integration via REST)
  - Domain-specific Hospitality Fallback Engine
- **DevOps & Version Control**:
  - Git
  - GitHub
  - Postman (Collection provided)

---

## Project Structure

```
Hospitality_Platform/
├── backend/                               # Spring Boot Application
│   ├── src/main/java/com/hospitality/
│   │   ├── config/                        # DataSeeder, App configuration
│   │   ├── controller/                    # REST API Controllers (Auth, Hotel, Room, Booking, User, Admin, Chatbot)
│   │   ├── dto/                           # Data Transfer Objects (Requests, Responses)
│   │   ├── entity/                        # JPA Entities (User, Hotel, Room, Booking, ChatbotMessage, Enums)
│   │   ├── exception/                     # Custom Exceptions & GlobalExceptionHandler
│   │   ├── repository/                    # Spring Data JPA Repositories
│   │   ├── security/                      # JWT Provider, Auth Filter, SecurityConfig, UserDetailsService
│   │   ├── service/                       # Business Logic Layer
│   │   └── HospitalityApplication.java    # Spring Boot Main Class
│   ├── src/main/resources/
│   │   ├── application.properties         # Main application configuration (no credentials)
│   │   └── application-example.properties # Example properties template
│   └── pom.xml                            # Maven dependencies & build setup
│
├── frontend/                              # React.js SPA (Vite)
│   ├── src/
│   │   ├── api/                           # Axios client & modular API service calls
│   │   ├── components/                    # Reusable UI components (Navbar, Footer, HotelCard, RoomCard, BookingModal, ChatbotWidget, etc.)
│   │   ├── context/                       # AuthContext for user state, JWT, and role management
│   │   ├── pages/                         # Application pages (Home, Hotels, HotelDetails, MyBookings, Profile, AdminDashboard, Login, Register, ChatbotPage)
│   │   ├── App.jsx                        # React Router routing configuration
│   │   ├── main.jsx                       # Application entry point
│   │   └── index.css                      # Design system and responsive styles
│   ├── index.html                         # HTML template
│   ├── package.json                       # Frontend dependencies & scripts
│   └── vite.config.js                     # Vite build & dev server configuration
│
├── .env.example                           # Example environment variable template
├── .gitignore                             # Git ignore rules for secrets, targets, and dependencies
├── postman_collection.json                # Ready-to-import Postman API collection
└── README.md                              # Project documentation
```

---

## Database Setup

1. Make sure **PostgreSQL** is installed and running locally on port `5432`.
2. Connect to your PostgreSQL instance using `psql` or `pgAdmin`:
   ```bash
   psql -U postgres -h localhost -p 5432
   ```
3. Create the database:
   ```sql
   CREATE DATABASE hospitality_db;
   ```
4. Verify the database exists:
   ```sql
   \l
   ```
5. Spring Boot will automatically manage and update tables on startup via `spring.jpa.hibernate.ddl-auto=update`.

> **Security Note**: Never commit your database password to version control. Pass your database credentials using environment variables or a local configuration file as described below.

---

## Environment Variables

Copy `.env.example` or set the following environment variables on your system:

| Variable | Description | Example / Default |
|---|---|---|
| `DB_HOST` | PostgreSQL Host | `localhost` |
| `DB_PORT` | PostgreSQL Port | `5432` |
| `DB_NAME` | Database Name | `hospitality_db` |
| `DB_USERNAME` | Database Username | `postgres` |
| `DB_PASSWORD` | Database Password | `your_password_here` |
| `SERVER_PORT` | Spring Boot Server Port | `8080` |
| `JWT_SECRET` | 256-bit secret key for HMAC-SHA256 | `your_secret_key_here` |
| `JWT_EXPIRATION` | Token expiration time (ms) | `86400000` (24 Hours) |
| `AI_API_KEY` | Google Gemini API Key *(Optional)* | *(Empty - uses fallback engine)* |

---

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project with Maven:
   ```bash
   mvn clean package -DskipTests
   ```
3. Run the Spring Boot application:
   ```bash
   # On Windows (PowerShell)
   $env:DB_PASSWORD="your_password_here"; java -jar target/hospitality-platform-1.0.0.jar

   # On Linux/macOS
   DB_PASSWORD=your_password_here java -jar target/hospitality-platform-1.0.0.jar
   ```
4. The backend will start on **`http://localhost:8080`**.
   - On the first start, it will automatically connect to PostgreSQL and seed initial hotels, rooms, and test users.

---

## Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend will start on **`http://localhost:5173`**.

---

## How to Run

1. **Start PostgreSQL**: Ensure PostgreSQL is running on port `5432` and `hospitality_db` is created.
2. **Start Backend**: Run `java -jar target/hospitality-platform-1.0.0.jar` (or `mvn spring-boot:run`) in `backend/`.
3. **Start Frontend**: Run `npm run dev` in `frontend/`.
4. **Open Browser**: Go to `http://localhost:5173`.
5. **Test Accounts**:
   - **Admin**: `admin@hospitality.com` / `Admin@123`
   - **User**: `rahul@gmail.com` / `User@123`
   - **User**: `priya@gmail.com` / `User@123`
   *(Convenient one-click autofill buttons are available on the Login page).*

---

## API Documentation

All endpoints are prefixed with `/api`. Protected routes require the `Authorization: Bearer <JWT_TOKEN>` header.

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `phone`).
- `POST /api/auth/login` — Login with credentials; returns JWT token, user info, and role.

### 2. Hotels (`/api/hotels`)
- `GET /api/hotels` — Retrieve all hotels with starting prices.
- `GET /api/hotels/{id}` — Retrieve a single hotel with its rooms and amenities.
- `GET /api/hotels/search` — Search hotels by `city`, `name`, `minRating`, `minPrice`, `maxPrice`, and `sortBy`.
- `POST /api/hotels` — Create a new hotel (*Admin only*).
- `PUT /api/hotels/{id}` — Update hotel details (*Admin only*).
- `DELETE /api/hotels/{id}` — Delete a hotel (*Admin only*).

### 3. Rooms (`/api/rooms` and `/api/hotels/{hotelId}/rooms`)
- `GET /api/hotels/{hotelId}/rooms` — List rooms belonging to a hotel.
- `POST /api/hotels/{hotelId}/rooms` — Add a room to a hotel (*Admin only*).
- `GET /api/rooms/{id}` — Retrieve single room details.
- `PUT /api/rooms/{id}` — Update room details (*Admin only*).
- `PATCH /api/rooms/{id}/toggle` — Toggle room availability (*Admin only*).
- `DELETE /api/rooms/{id}` — Delete a room (*Admin only*).

### 4. Bookings (`/api/bookings`)
- `POST /api/bookings` — Create a room reservation (validates dates, capacity, and overlapping conflicts).
- `GET /api/bookings/my` — Get current user's booking history.
- `GET /api/bookings/{id}` — Get single booking details.
- `PUT /api/bookings/{id}/cancel` — Cancel a confirmed booking.

### 5. User Profile (`/api/users`)
- `GET /api/users/profile` — Get authenticated user's profile.
- `PUT /api/users/profile` — Update name and phone number.

### 6. Admin Analytics & Management (`/api/admin`)
- `GET /api/admin/statistics` — Get platform metrics: total users, hotels, rooms, bookings, and revenue (*Admin only*).
- `GET /api/admin/users` — List all registered user accounts (*Admin only*).
- `GET /api/admin/bookings` — List all reservations across the system (*Admin only*).

### 7. AI Chatbot (`/api/chatbot`)
- `POST /api/chatbot/message` — Send a query to the AI concierge; returns smart suggestions or policy answers.
- `GET /api/chatbot/history` — Retrieve previous chat history for the logged-in user.

---

## Future Improvements

- **Payment Gateway Integration**: Integrate Razorpay or Stripe for real-time online payments.
- **Email & SMS Notifications**: Send booking confirmation emails and reminder SMS using Spring Mail and Twilio.
- **Customer Reviews & Ratings**: Allow verified guests to leave reviews and upload photos after completed stays.
- **Multi-Room Bookings**: Enable reserving multiple rooms in a single transaction.
- **Redis Caching**: Cache popular city searches and hotel listings to accelerate response times under heavy load.

---

## License

This project is created for educational and portfolio demonstration purposes.
