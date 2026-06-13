# LendMe — Campus Peer-to-Peer Rental Marketplace

> A hyper-local rental platform exclusively for KNUST students.  
> Built with React Native (Android) · Spring Boot · PostgreSQL

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Team Responsibilities](#team-responsibilities)
3. [MVP Feature Scope](#mvp-feature-scope)
4. [Part 1 — Frontend (React Native)](#part-1--frontend-react-native)
5. [Part 2 — Backend (Spring Boot)](#part-2--backend-spring-boot)
6. [Part 3 — Database (PostgreSQL)](#part-3--database-postgresql)
7. [Environment Variables](#environment-variables)
8. [How to Run the Project](#how-to-run-the-project)

---

## Project Overview

UniSwap connects KNUST students who need to rent items with students who are willing to lend them — all within a trusted, university-verified community. Students sign up with their `knust.edu.gh` email, list items they own, and rent items from peers with a calendar-based booking system, in-app messaging, and a ratings system.

---

## Team Responsibilities

| Member | Role | Stack |
|--------|------|-------|
| Member 1 | Frontend Lead | React Native, navigation, screens |
| Member 2 | Frontend Support | React Native, components, state management |
| Member 3 | Backend | Spring Boot, REST API, WebSocket, JWT |
| Member 4 | Database | PostgreSQL, schema design, queries |

---

## MVP Feature Scope

These are the only features being built for this demo. Nothing outside this list is in scope.

| # | Feature | Who Owns It |
|---|---------|-------------|
| 1 | KNUST email registration + JWT auth with refresh tokens | Backend + Frontend |
| 2 | Item listing (photo, description, price, availability) | Frontend + Backend + DB |
| 3 | Search and filter items (category, price range) | Frontend + Backend |
| 4 | Calendar-based booking system | Frontend + Backend + DB |
| 5 | In-app real-time messaging (WebSocket) | Backend + Frontend |
| 6 | Ratings and reviews after completed rental | Frontend + Backend + DB |
| 7 | Simulated transaction / payment flow | Frontend + Backend |
| 8 | User profile page | Frontend + Backend |

---

---

# Part 1 — Frontend (React Native)

## Tech Stack

| Tool | Purpose |
|------|---------|
| React Native (CLI) | Android app framework |
| React Navigation v6 | Screen navigation |
| Zustand | Global state management |
| Axios | HTTP client for API calls |
| Socket.io-client | Real-time messaging |
| React Native Image Picker | Camera/gallery access for listings |
| React Native Calendars | Calendar UI for booking |
| AsyncStorage | Storing JWT tokens locally |
| React Native Paper | UI component library |

## Setup Instructions

```bash
# Prerequisites: Node.js, JDK 17, Android Studio, Android SDK

# 1. Create the project
npx react-native init UniSwap --template react-native-template-typescript

cd UniSwap

# 2. Install dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install zustand axios
npm install socket.io-client
npm install react-native-image-picker
npm install react-native-calendars
npm install @react-native-async-storage/async-storage
npm install react-native-paper react-native-vector-icons

# 3. Link native dependencies
npx react-native link react-native-vector-icons

# 4. Run on Android
npx react-native run-android
```

## Folder Structure

```
UniSwap/
├── android/                          # Android native files (do not touch unless needed)
├── ios/                              # Not used (Android only MVP)
├── src/
│   ├── api/
│   │   ├── axiosInstance.ts          # Axios base URL + auth interceptor (attaches JWT)
│   │   ├── authApi.ts                # login, register, refresh token calls
│   │   ├── itemsApi.ts               # list item, get items, search, filter
│   │   ├── bookingApi.ts             # create booking, get bookings, cancel
│   │   ├── messageApi.ts             # get conversation history
│   │   └── reviewApi.ts             # submit and fetch reviews
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppButton.tsx         # Reusable button with loading state
│   │   │   ├── AppInput.tsx          # Reusable text input with validation
│   │   │   ├── AppLoader.tsx         # Centered loading spinner
│   │   │   ├── ErrorMessage.tsx      # Inline error display component
│   │   │   └── Avatar.tsx            # User profile image with fallback initials
│   │   │
│   │   ├── items/
│   │   │   ├── ItemCard.tsx          # Card shown in search results and listings
│   │   │   ├── ItemImageCarousel.tsx # Swipeable image gallery for item detail
│   │   │   ├── CategoryPicker.tsx    # Horizontal scroll category selector
│   │   │   └── PriceRangeSlider.tsx  # Filter slider for min/max daily price
│   │   │
│   │   ├── booking/
│   │   │   ├── BookingCalendar.tsx   # Date range picker using react-native-calendars
│   │   │   ├── BookingSummary.tsx    # Shows dates, total price before confirmation
│   │   │   └── BookingStatusBadge.tsx # "Pending", "Active", "Completed" badge
│   │   │
│   │   ├── messaging/
│   │   │   ├── ChatBubble.tsx        # Individual message bubble (sent/received)
│   │   │   ├── ConversationCard.tsx  # Preview card in the inbox list
│   │   │   └── TypingIndicator.tsx   # Animated "..." when other user is typing
│   │   │
│   │   └── reviews/
│   │       ├── StarRating.tsx        # Tappable star rating input
│   │       └── ReviewCard.tsx        # Displays a single review with rating + text
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx          # Root navigator — switches Auth vs Main stack
│   │   ├── AuthNavigator.tsx         # Stack: Splash → Login → Register
│   │   ├── MainNavigator.tsx         # Bottom tab navigator for authenticated users
│   │   └── types.ts                  # TypeScript types for all route params
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.tsx      # Logo + auto-login check using stored token
│   │   │   ├── LoginScreen.tsx       # Email + password login form
│   │   │   └── RegisterScreen.tsx    # Name, knust.edu.gh email, password registration
│   │   │
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx        # Search bar + category filter + item grid
│   │   │   └── SearchResultsScreen.tsx # Filtered/searched items list
│   │   │
│   │   ├── items/
│   │   │   ├── ItemDetailScreen.tsx  # Full item view: images, description, Book Now
│   │   │   ├── CreateListingScreen.tsx # Form to list a new item for rent
│   │   │   └── MyListingsScreen.tsx  # Lender's view of their own listed items
│   │   │
│   │   ├── booking/
│   │   │   ├── BookingScreen.tsx     # Calendar date selection + total price preview
│   │   │   ├── BookingConfirmScreen.tsx # Final confirm screen before simulated pay
│   │   │   ├── PaymentSimulationScreen.tsx # Fake payment screen for demo
│   │   │   └── MyBookingsScreen.tsx  # Borrower's active and past rentals
│   │   │
│   │   ├── messaging/
│   │   │   ├── InboxScreen.tsx       # List of all conversations
│   │   │   └── ChatScreen.tsx        # Individual chat with real-time WebSocket
│   │   │
│   │   ├── reviews/
│   │   │   └── LeaveReviewScreen.tsx # Star rating + comment after rental ends
│   │   │
│   │   └── profile/
│   │       └── ProfileScreen.tsx     # User info, listings count, reviews received
│   │
│   ├── store/
│   │   ├── authStore.ts              # Zustand store: user, tokens, login, logout
│   │   ├── itemStore.ts              # Zustand store: items list, filters, selected item
│   │   ├── bookingStore.ts           # Zustand store: active bookings, selected dates
│   │   └── messageStore.ts           # Zustand store: conversations, unread count
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                # Wraps authStore for easy component access
│   │   ├── useSocket.ts              # Initializes and returns socket.io connection
│   │   └── useTokenRefresh.ts        # Axios interceptor: auto-refresh expired tokens
│   │
│   ├── utils/
│   │   ├── tokenStorage.ts           # AsyncStorage: save, get, delete JWT tokens
│   │   ├── dateHelpers.ts            # Format dates, calculate rental duration/price
│   │   ├── validators.ts             # Email domain check (knust.edu.gh), password rules
│   │   └── constants.ts             # API base URL, item categories, app config
│   │
│   └── types/
│       ├── user.types.ts             # User, AuthResponse, LoginPayload types
│       ├── item.types.ts             # Item, Category, ListingPayload types
│       ├── booking.types.ts          # Booking, BookingStatus, DateRange types
│       ├── message.types.ts          # Message, Conversation, SocketEvent types
│       └── review.types.ts           # Review, RatingPayload types
│
├── App.tsx                           # Entry point — wraps AppNavigator in providers
├── index.js                          # React Native entry (do not touch)
├── .env                              # API base URL (not committed to git)
├── .gitignore
├── tsconfig.json
└── package.json
```

## Key Implementation Notes

### JWT Token Flow (Frontend Side)
1. On login, store both `accessToken` and `refreshToken` in AsyncStorage via `tokenStorage.ts`
2. `axiosInstance.ts` attaches `accessToken` to every request header
3. `useTokenRefresh.ts` intercepts 401 responses, calls the refresh endpoint, stores the new token, and retries the original request
4. On logout, delete both tokens from AsyncStorage and clear auth store

### Real-Time Messaging (Frontend Side)
1. `useSocket.ts` connects to the backend WebSocket server on app launch using the access token
2. `ChatScreen.tsx` joins a room using the `conversationId`
3. Incoming messages update `messageStore` and re-render the chat list
4. `InboxScreen.tsx` shows unread badge count from `messageStore`

### KNUST Email Validation
```typescript
// validators.ts
export const isKnustEmail = (email: string): boolean => {
  return email.trim().toLowerCase().endsWith('@knust.edu.gh');
};
```

---

---

# Part 2 — Backend (Spring Boot)

## Tech Stack

| Tool | Purpose |
|------|---------|
| Spring Boot 3.x | Application framework |
| Spring Security | Authentication + authorization |
| Spring Data JPA | Database ORM |
| JJWT (jwtok) | JWT access + refresh token generation |
| WebSocket (STOMP) | Real-time messaging |
| PostgreSQL Driver | DB connection |
| Lombok | Reduce boilerplate (getters, constructors) |
| ModelMapper | DTO to entity mapping |
| Spring Mail (optional) | Email verification (can be simulated) |

## Maven Dependencies (pom.xml)

```xml
<dependencies>
  <!-- Spring Boot -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>

  <!-- PostgreSQL -->
  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
  </dependency>

  <!-- JWT -->
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
  </dependency>
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
  </dependency>
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
  </dependency>

  <!-- Lombok -->
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>

  <!-- ModelMapper -->
  <dependency>
    <groupId>org.modelmapper</groupId>
    <artifactId>modelmapper</artifactId>
    <version>3.1.1</version>
  </dependency>
</dependencies>
```

## Folder Structure

```
src/main/java/com/uniswap/
│
├── UniSwapApplication.java              # Main entry point (@SpringBootApplication)
│
├── config/
│   ├── SecurityConfig.java              # Spring Security: JWT filter, open vs secured routes
│   ├── WebSocketConfig.java             # STOMP WebSocket broker config + SockJS endpoint
│   ├── CorsConfig.java                  # Allow requests from React Native app
│   └── ModelMapperConfig.java           # ModelMapper bean configuration
│
├── auth/
│   ├── controller/
│   │   └── AuthController.java          # POST /api/auth/register, /login, /refresh, /logout
│   ├── service/
│   │   ├── AuthService.java             # Register, login, token refresh logic
│   │   └── KnustEmailValidator.java     # Validates @knust.edu.gh domain
│   ├── dto/
│   │   ├── RegisterRequest.java         # name, email, password
│   │   ├── LoginRequest.java            # email, password
│   │   ├── AuthResponse.java            # accessToken, refreshToken, user info
│   │   └── RefreshTokenRequest.java     # refreshToken string
│   └── entity/
│       └── RefreshToken.java            # DB entity: id, token, user, expiryDate
│
├── user/
│   ├── controller/
│   │   └── UserController.java          # GET /api/users/me, PUT /api/users/me
│   ├── service/
│   │   └── UserService.java             # Get profile, update profile logic
│   ├── dto/
│   │   ├── UserProfileDto.java          # name, email, profilePhoto, joinDate
│   │   └── UpdateProfileRequest.java    # name, profilePhoto fields
│   └── entity/
│       └── User.java                    # id, name, email, passwordHash, profilePhoto, createdAt
│
├── item/
│   ├── controller/
│   │   └── ItemController.java          # CRUD + search/filter endpoints
│   │   # GET  /api/items             — all items (paginated)
│   │   # GET  /api/items/{id}        — single item detail
│   │   # GET  /api/items/search      — ?query=&category=&minPrice=&maxPrice=
│   │   # POST /api/items             — create listing (auth required)
│   │   # PUT  /api/items/{id}        — update listing (owner only)
│   │   # DELETE /api/items/{id}      — delete listing (owner only)
│   ├── service/
│   │   └── ItemService.java             # Business logic: create, search, filter, ownership check
│   ├── dto/
│   │   ├── CreateItemRequest.java       # title, description, category, dailyPrice, images
│   │   ├── UpdateItemRequest.java       # same fields, all optional
│   │   └── ItemResponseDto.java         # full item data returned to client
│   └── entity/
│       └── Item.java                    # id, owner, title, desc, category, dailyPrice, images, available, createdAt
│
├── booking/
│   ├── controller/
│   │   └── BookingController.java
│   │   # POST /api/bookings             — create booking (borrower)
│   │   # GET  /api/bookings/mine        — get my bookings (borrower)
│   │   # GET  /api/bookings/lender      — get bookings on my items (lender)
│   │   # PUT  /api/bookings/{id}/status — approve / reject / complete (lender)
│   │   # DELETE /api/bookings/{id}      — cancel booking (borrower)
│   ├── service/
│   │   └── BookingService.java          # Date conflict check, status transitions, total price calc
│   ├── dto/
│   │   ├── CreateBookingRequest.java    # itemId, startDate, endDate
│   │   ├── UpdateBookingStatusRequest.java # status: APPROVED | REJECTED | COMPLETED
│   │   └── BookingResponseDto.java      # full booking info returned to client
│   └── entity/
│       └── Booking.java                 # id, borrower, item, startDate, endDate, status, totalPrice, createdAt
│
├── messaging/
│   ├── controller/
│   │   ├── MessageController.java       # REST: GET /api/conversations, GET /api/conversations/{id}/messages
│   │   └── ChatWebSocketController.java # WebSocket: @MessageMapping("/chat.send")
│   ├── service/
│   │   └── MessageService.java          # Save message, get conversation history
│   ├── dto/
│   │   ├── SendMessageRequest.java      # conversationId, content
│   │   ├── MessageDto.java              # id, sender, content, sentAt
│   │   └── ConversationDto.java         # id, participants, lastMessage, unreadCount
│   └── entity/
│       ├── Conversation.java            # id, participant1, participant2, createdAt
│       └── Message.java                 # id, conversation, sender, content, sentAt, isRead
│
├── review/
│   ├── controller/
│   │   └── ReviewController.java
│   │   # POST /api/reviews              — submit review after completed rental
│   │   # GET  /api/reviews/item/{id}    — all reviews for an item
│   │   # GET  /api/reviews/user/{id}    — all reviews for a user
│   ├── service/
│   │   └── ReviewService.java           # Validate booking is COMPLETED before allowing review
│   ├── dto/
│   │   ├── CreateReviewRequest.java     # bookingId, rating (1-5), comment
│   │   └── ReviewResponseDto.java       # id, reviewer name, rating, comment, createdAt
│   └── entity/
│       └── Review.java                  # id, booking, reviewer, reviewee, item, rating, comment, createdAt
│
├── payment/
│   ├── controller/
│   │   └── PaymentController.java       # POST /api/payments/simulate — demo only
│   ├── service/
│   │   └── PaymentService.java          # Simulates payment: marks booking as PAID, returns success
│   ├── dto/
│   │   ├── PaymentRequest.java          # bookingId, amount
│   │   └── PaymentResponse.java         # success, transactionRef (fake UUID), paidAt
│   └── entity/
│       └── Payment.java                 # id, booking, amount, transactionRef, status, paidAt
│
├── security/
│   ├── JwtService.java                  # Generate, validate, extract claims from JWT
│   ├── JwtAuthFilter.java               # OncePerRequestFilter: reads token, sets auth context
│   └── UserDetailsServiceImpl.java      # Loads user from DB for Spring Security
│
└── exception/
    ├── GlobalExceptionHandler.java      # @ControllerAdvice: consistent error responses
    ├── ResourceNotFoundException.java   # 404 errors
    ├── UnauthorizedException.java       # 403 errors
    └── ValidationException.java         # 400 validation errors
```

## API Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register with knust.edu.gh email |
| POST | /api/auth/login | No | Login, returns tokens |
| POST | /api/auth/refresh | No | Get new access token using refresh token |
| POST | /api/auth/logout | Yes | Invalidate refresh token |
| GET | /api/users/me | Yes | Get own profile |
| PUT | /api/users/me | Yes | Update own profile |
| GET | /api/items | No | Get all available items (paginated) |
| GET | /api/items/{id} | No | Get single item detail |
| GET | /api/items/search | No | Search + filter items |
| POST | /api/items | Yes | Create new listing |
| PUT | /api/items/{id} | Yes | Update own listing |
| DELETE | /api/items/{id} | Yes | Delete own listing |
| POST | /api/bookings | Yes | Request a booking |
| GET | /api/bookings/mine | Yes | My bookings as borrower |
| GET | /api/bookings/lender | Yes | Bookings on my items as lender |
| PUT | /api/bookings/{id}/status | Yes | Approve/reject/complete booking |
| DELETE | /api/bookings/{id} | Yes | Cancel booking |
| POST | /api/payments/simulate | Yes | Simulate payment for demo |
| GET | /api/conversations | Yes | Get all conversations |
| GET | /api/conversations/{id}/messages | Yes | Get chat history |
| POST | /api/reviews | Yes | Submit review |
| GET | /api/reviews/item/{id} | No | Get reviews for an item |
| GET | /api/reviews/user/{id} | No | Get reviews for a user |

## JWT Configuration (application.properties)

```properties
spring.application.name=uniswap

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/uniswap_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true

# JWT
jwt.secret=your_256_bit_secret_key_here
jwt.access-token-expiry=900000
jwt.refresh-token-expiry=604800000

# File uploads
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=20MB

# Server port
server.port=8080
```

## WebSocket Flow

```
Client connects to: ws://localhost:8080/ws (with JWT token as query param)
Client subscribes to: /user/queue/messages  (private messages)
Client subscribes to: /topic/conversation/{id}  (room messages)
Client sends to: /app/chat.send  (ChatWebSocketController handles this)
Server broadcasts to: /topic/conversation/{conversationId}
```

---

---

# Part 3 — Database (PostgreSQL)

## Setup

```bash
# Install PostgreSQL and create the database
psql -U postgres
CREATE DATABASE uniswap_db;
\c uniswap_db
```

## Full Schema

```sql
-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    profile_photo   TEXT,                          -- URL or file path
    is_verified     BOOLEAN DEFAULT FALSE,         -- knust email verified
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_knust_email CHECK (email LIKE '%@knust.edu.gh')
);

-- ============================================================
-- REFRESH TOKENS
-- ============================================================
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       TEXT NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ITEMS (Listings)
-- ============================================================
CREATE TYPE item_category AS ENUM (
    'ELECTRONICS',
    'CLOTHING',
    'TOOLS',
    'BOOKS',
    'SPORTS',
    'CAMPING',
    'PHOTOGRAPHY',
    'OTHER'
);

CREATE TABLE items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    category        item_category NOT NULL,
    daily_price     NUMERIC(10, 2) NOT NULL CHECK (daily_price > 0),
    is_available    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Item images stored separately (one item can have multiple images)
CREATE TABLE item_images (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id     UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    image_url   TEXT NOT NULL,
    is_primary  BOOLEAN DEFAULT FALSE,
    sort_order  INT DEFAULT 0
);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TYPE booking_status AS ENUM (
    'PENDING',      -- Borrower requested, waiting for lender
    'APPROVED',     -- Lender approved
    'REJECTED',     -- Lender rejected
    'PAID',         -- Payment simulated
    'ACTIVE',       -- Rental in progress (start date reached)
    'COMPLETED',    -- Rental finished
    'CANCELLED'     -- Borrower cancelled before approval
);

CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id         UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
    borrower_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    total_price     NUMERIC(10, 2) NOT NULL,
    status          booking_status NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_not_own_item CHECK (
        borrower_id != (SELECT owner_id FROM items WHERE id = item_id)
    )
);

-- Prevent double-booking: no two APPROVED/ACTIVE bookings can overlap for same item
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM bookings
        WHERE item_id = NEW.item_id
          AND id != NEW.id
          AND status IN ('APPROVED', 'ACTIVE', 'PAID')
          AND (NEW.start_date, NEW.end_date) OVERLAPS (start_date, end_date + 1)
    ) THEN
        RAISE EXCEPTION 'Item is already booked for the selected dates';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_overlap_check
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION check_booking_overlap();

-- ============================================================
-- PAYMENTS (Simulated)
-- ============================================================
CREATE TYPE payment_status AS ENUM ('SIMULATED', 'FAILED');

CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id          UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE RESTRICT,
    amount              NUMERIC(10, 2) NOT NULL,
    transaction_ref     VARCHAR(100) NOT NULL UNIQUE,  -- fake UUID for demo
    status              payment_status DEFAULT 'SIMULATED',
    paid_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_1   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    participant_2   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Each pair of users can only have one conversation
    CONSTRAINT unique_conversation UNIQUE (
        LEAST(participant_1::TEXT, participant_2::TEXT),
        GREATEST(participant_1::TEXT, participant_2::TEXT)
    ),
    CONSTRAINT chk_no_self_chat CHECK (participant_1 != participant_2)
);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content             TEXT NOT NULL,
    is_read             BOOLEAN DEFAULT FALSE,
    sent_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, sent_at DESC);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    reviewer_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id         UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- One review per booking per reviewer
    CONSTRAINT unique_review_per_booking UNIQUE (booking_id, reviewer_id),
    CONSTRAINT chk_no_self_review CHECK (reviewer_id != reviewee_id)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_items_owner ON items(owner_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_available ON items(is_available);
CREATE INDEX idx_bookings_item ON bookings(item_id);
CREATE INDEX idx_bookings_borrower ON bookings(borrower_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_item ON reviews(item_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
```

## Entity Relationship Summary

```
users
  ├── owns many → items
  ├── has many → bookings (as borrower)
  ├── has many → refresh_tokens
  ├── participates in many → conversations
  ├── sends many → messages
  └── writes/receives many → reviews

items
  ├── belongs to → users (owner)
  ├── has many → item_images
  ├── has many → bookings
  └── has many → reviews

bookings
  ├── belongs to → items
  ├── belongs to → users (borrower)
  ├── has one → payments
  └── has one or two → reviews (borrower reviews lender, lender reviews borrower)

conversations
  ├── belongs to → users (participant_1, participant_2)
  └── has many → messages
```

## Useful Queries

```sql
-- Get all available items in a category, sorted by price
SELECT i.*, u.name AS owner_name, ii.image_url AS primary_image
FROM items i
JOIN users u ON u.id = i.owner_id
LEFT JOIN item_images ii ON ii.item_id = i.id AND ii.is_primary = TRUE
WHERE i.is_available = TRUE
  AND i.category = 'ELECTRONICS'
ORDER BY i.daily_price ASC;

-- Check if an item is available for a date range
SELECT COUNT(*) = 0 AS is_available
FROM bookings
WHERE item_id = 'your-item-uuid'
  AND status IN ('APPROVED', 'ACTIVE', 'PAID')
  AND (start_date, end_date + 1) OVERLAPS ('2025-08-01'::DATE, '2025-08-05'::DATE);

-- Get average rating for an item
SELECT item_id, ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS total_reviews
FROM reviews
WHERE item_id = 'your-item-uuid'
GROUP BY item_id;

-- Get full conversation with messages
SELECT m.content, m.sent_at, m.is_read,
       u.name AS sender_name
FROM messages m
JOIN users u ON u.id = m.sender_id
WHERE m.conversation_id = 'your-conversation-uuid'
ORDER BY m.sent_at ASC;
```

---

## Environment Variables

### Backend (.env or application.properties)
```
DB_URL=jdbc:postgresql://localhost:5432/uniswap_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=minimum_32_character_secret_key_here
JWT_ACCESS_EXPIRY=900000
JWT_REFRESH_EXPIRY=604800000
```

### Frontend (.env)
```
API_BASE_URL=http://10.0.2.2:8080/api
WEBSOCKET_URL=ws://10.0.2.2:8080/ws
```
> Note: `10.0.2.2` is how Android emulator accesses your local machine's localhost.

---

## How to Run the Project

### Database
```bash
psql -U postgres -d uniswap_db -f schema.sql
```

### Backend
```bash
cd uniswap-backend
./mvnw spring-boot:run
# API available at http://localhost:8080
```

### Frontend
```bash
cd UniSwap
npx react-native start
# In a new terminal:
npx react-native run-android
```

---

## Git Repository Structure (Recommended)

```
uniswap/
├── UniSwap/           # React Native frontend (Members 1 & 2)
├── uniswap-backend/   # Spring Boot backend (Member 3)
├── database/
│   └── schema.sql     # Full DB schema (Member 4)
└── README.md          # This file
```
