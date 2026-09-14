# GLIDE

Premium vehicle booking platform for users, partners, and admins. GLIDE combines ride discovery, partner onboarding, realtime location sharing, ride chat, OTP-gated trip progression, Razorpay payments, document verification, and video KYC into one full-stack application.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Application Routes](#application-routes)
- [API Reference](#api-reference)
- [Realtime Server](#realtime-server)
- [Database Models](#database-models)
- [Core Flows](#core-flows)
- [Important Notes](#important-notes)

## Overview

GLIDE is split into two applications:

- `glide-client`: the main Next.js application. It renders the UI, owns the Auth.js session layer, exposes API routes, talks to MongoDB through Mongoose, handles payments, uploads, email OTPs, maps, chat persistence, admin review workflows, and partner dashboards.
- `glide-server`: a lightweight Express and Socket.IO service. It manages realtime socket identity, online partner locations, ride rooms, live driver updates, realtime chat broadcasting, and targeted event emission.

The client can run on its own for static pages and database-backed API flows, but realtime booking alerts, online vehicle discovery, live ride tracking, and socket chat require the server.

## Project Structure

```text
glide/
  glide-client/
    public/                 Static brand and page assets
    src/
      app/                  Next.js App Router pages and API routes
      components/           UI modules for home, booking, partner, admin, ride, auth
      data/                 Navigation, fleet, booking, auth, and onboarding constants
      hooks/                Client hooks for user hydration and motion effects
      lib/                  DB, Cloudinary, Razorpay, socket, email, animation utilities
      models/               Mongoose models used by API routes
      provider/             Auth.js session provider
      redux/                Redux store and slices
      types/                Shared TypeScript types
      auth.ts               Auth.js v5 configuration
      initUser.ts           Session-aware Redux user hydration
      proxy.ts              Route protection and role redirects
    package.json
    next.config.ts
    tsconfig.json

  glide-server/
    src/
      index.ts              Express, Socket.IO, MongoDB connection, realtime events
      models/
        User.model.ts       Socket/location compatible user model
    package.json
    tsconfig.json

  .gitignore
  README.md
```

Generated folders such as `node_modules`, `.next`, and `dist` are build artifacts and are not part of the source design.

## Tech Stack

### Client

- Next.js `16.2.9` with App Router
- React `19.2.4`
- TypeScript
- Tailwind CSS v4
- Auth.js / NextAuth v5 beta
- MongoDB with Mongoose
- Redux Toolkit and React Redux
- Axios
- Zod validation
- Razorpay payments
- Cloudinary uploads
- Nodemailer Gmail SMTP
- Leaflet and React Leaflet maps
- Socket.IO client
- ZegoCloud video UI kit
- Motion animations
- Recharts dashboards
- Lucide React icons

### Server

- Node.js
- Express `5`
- Socket.IO
- MongoDB with Mongoose
- CORS
- dotenv
- TypeScript

## Features

### User

- Email/password signup with email OTP verification
- Google OAuth login
- Protected session-based navigation
- Vehicle type selection: bike, car, EV, loading, truck
- Pickup and dropoff search flow
- Nearby vehicle discovery using partner geolocation
- Booking creation with realtime partner notification
- Razorpay order creation and payment verification
- Active ride page with live driver location
- Ride chat with persisted messages
- AI quick reply suggestions
- Booking history, filters, details, route, financials, status timeline

### Partner

- Partner onboarding through vehicle, document, bank, pricing, KYC, and approval steps
- Vehicle number validation for Indian registration format
- Cloudinary upload support for Aadhaar, license, RC, and vehicle image
- Bank and UPI detail capture
- Pricing setup with base fare, per-km fare, and waiting charge
- Pending booking request dashboard
- Accept or reject incoming ride requests
- Active ride view with live driver location emission
- Pickup and dropoff OTP generation and verification
- Earnings dashboard

### Admin

- Admin dashboard with partner and vehicle review counts
- Partner review detail page with documents, bank details, vehicle data, and profile info
- Partner approve/reject workflow
- Vehicle review approve/reject workflow
- Video KYC room generation
- Video KYC approval/rejection workflow
- Admin earnings overview based on booking commissions

### Realtime

- Socket identity registration by user id
- Partner online/offline state
- Partner geolocation persistence as GeoJSON points
- Targeted socket event emission through `/emit`
- Ride room joining by booking id
- Live driver location updates
- Ride chat broadcast events

## Architecture

```text
Browser
  |
  | Next.js pages, Auth.js session, Redux state
  v
glide-client
  |
  | API routes, Mongoose models, Razorpay, Cloudinary, SMTP, Gemini
  v
MongoDB + external services

Browser
  |
  | Socket.IO client
  v
glide-server
  |
  | online status, socket id, live location
  v
MongoDB
```

The Next.js app is the business-logic layer. The Socket.IO server is intentionally small and focused on realtime transport.

## Getting Started

### Prerequisites

- Node.js `20+` recommended
- npm
- MongoDB database URL
- Gmail app password or SMTP-compatible Gmail credentials
- Cloudinary account
- Razorpay test or live keys
- Google OAuth credentials
- ZegoCloud app credentials
- Gemini API endpoint URL

### 1. Install Dependencies

```bash
cd glide-client
npm install

cd ../glide-server
npm install
```

### 2. Configure Environment Files

Create `.env` files inside both app folders. Use the variable tables below as the source of truth.

### 3. Run the Socket Server

```bash
cd glide-server
npm run dev
```

Default server port is `8000` unless `PORT` is set.

### 4. Run the Next.js Client

```bash
cd glide-client
npm run dev
```

The client usually runs at `http://localhost:3000`.

### 5. Recommended Local URLs

```text
Client:        http://localhost:3000
Socket server: http://localhost:8000
```

Set `NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:8000` in `glide-client/.env` and `NEXT_BASE_URL=http://localhost:3000` in `glide-server/.env`.

## Environment Variables

Do not commit real `.env` values. The names below were identified from the source files.

### `glide-client/.env`

| Variable | Purpose |
| --- | --- |
| `DB_URL` | MongoDB connection string used by Mongoose in Next.js API routes |
| `AUTH_SECRET` | Auth.js session/JWT secret |
| `AUTH_GOOGLE_ID` | Google OAuth client id |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `EMAIL` | Gmail address used by Nodemailer |
| `PASS` | Gmail app password or mail auth password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_ZEGO_APP_ID` | Public ZegoCloud app id |
| `NEXT_PUBLIC_ZEGO_SERVER_SECRET` | ZegoCloud server secret used by client-side KYC call UI |
| `KYC_SECRET_SALT` | Salt used while generating video KYC room ids |
| `NEXT_PUBLIC_SOCKET_SERVER_URL` | Socket.IO server URL, for example `http://localhost:8000` |
| `RAZORPAY_API_KEY` | Razorpay key id used on the server |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key id used by checkout UI |
| `RAZORPAY_API_SECRET` | Razorpay key secret used for order creation and signature verification |
| `NEXT_PUBLIC_LEAFLET_API_KEY` | Public map/geocoding API key used by booking UI |
| `GEMINI_API_URL` | Gemini API endpoint used for chat reply suggestions |

### `glide-server/.env`

| Variable | Purpose |
| --- | --- |
| `DB_URL` | MongoDB connection string used by the realtime server |
| `PORT` | Express and Socket.IO port, defaults to `8000` |
| `NEXT_BASE_URL` | Allowed CORS origin for the Next.js client |

## Scripts

### Client

```bash
npm run dev      # Start Next.js in development
npm run build    # Build production client
npm run start    # Start production client
npm run lint     # Run ESLint
```

### Server

```bash
npm run dev      # Rebuild TypeScript and run dist on source changes
npm run build    # Compile TypeScript to dist
npm run start    # Run compiled dist/index.js
```

## Application Routes

### Public and Shared

| Route | Purpose |
| --- | --- |
| `/` | Home page for guests/users, partner dashboard for partners, admin dashboard for admins |
| `/about` | About page |
| `/contact` | Contact page |
| `/video-kyc/[roomId]` | ZegoCloud video KYC room |

### User

| Route | Purpose |
| --- | --- |
| `/user/book` | Pickup/dropoff and vehicle type booking form |
| `/user/search` | Nearby vehicle search and map results |
| `/user/checkout` | Razorpay checkout flow |
| `/user/ride/[id]` | Active ride tracking and chat |
| `/user/bookings` | User booking history and details |

### Partner

| Route | Purpose |
| --- | --- |
| `/partner/onboarding/vehicle` | Vehicle registration |
| `/partner/onboarding/document` | Document upload |
| `/partner/onboarding/bank` | Bank and mobile number setup |
| `/partner/bookings` | Partner booking history |
| `/partner/pending-requests` | Incoming ride requests |
| `/partner/active-ride` | Active ride control panel |

### Admin

| Route | Purpose |
| --- | --- |
| `/admin/reviews/partner/[id]` | Partner review details |
| `/admin/reviews/vehicle/[id]` | Vehicle review details |

## API Reference

All API routes live inside `glide-client/src/app/api`.

### Auth

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register user, hash password, generate email OTP |
| `POST` | `/api/auth/verify-otp` | Verify email OTP and activate account |
| `GET/POST` | `/api/auth/[...nextauth]` | Auth.js handlers for credentials and Google OAuth |

### User and Booking

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/user/me` | Return current authenticated user without password |
| `GET` | `/api/user/bookings` | Fetch current user's bookings |
| `POST` | `/api/user/my-active` | Fetch a specific active user booking |
| `POST` | `/api/nearby-vehicles` | Find approved online partner vehicles within 5 km |
| `POST` | `/api/booking/create` | Create a ride request and notify partner by socket |
| `GET` | `/api/booking/active` | Fetch current user's active booking |
| `PATCH` | `/api/booking/[id]/confirm` | Confirm booking, including cash-payment path |
| `PATCH` | `/api/booking/[id]/cancel` | Cancel booking |

### Payments

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/payment/create` | Create Razorpay order and mark booking awaiting payment |
| `POST` | `/api/payment/verify` | Verify Razorpay signature, mark payment paid, calculate 10% admin commission |

### Partner

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/partner/onboarding/vehicle` | Create or update partner vehicle |
| `GET` | `/api/partner/onboarding/vehicle` | Fetch current partner vehicle |
| `POST` | `/api/partner/onboarding/document` | Upload Aadhaar, license, and RC files to Cloudinary |
| `POST` | `/api/partner/onboarding/bank` | Save bank, UPI, IFSC, and mobile details |
| `GET` | `/api/partner/onboarding/bank` | Fetch bank details |
| `PATCH` | `/api/partner/onboarding/pricing` | Save vehicle fare settings and optional image |
| `GET` | `/api/partner/onboarding/pricing` | Fetch pricing details |
| `GET` | `/api/partner/bookings` | Fetch partner bookings |
| `GET` | `/api/partner/bookings/pending` | Fetch pending ride requests |
| `GET` | `/api/partner/bookings/pending-request` | Return pending request count |
| `PATCH` | `/api/partner/bookings/[id]/accept` | Accept a requested booking and notify user |
| `PATCH` | `/api/partner/bookings/[id]/reject` | Reject a requested booking and notify user |
| `GET` | `/api/partner/my-active` | Fetch partner's active ride |
| `GET` | `/api/partner/earning` | Fetch partner earning data |
| `PATCH` | `/api/partner/videoKyc/retry` | Reset rejected KYC to pending |

### Ride OTP

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/partner/bookings/otp/pickup/send` | Generate and email pickup OTP |
| `POST` | `/api/partner/bookings/otp/pickup/verify` | Verify pickup OTP and start ride |
| `POST` | `/api/partner/bookings/otp/dropoff/send` | Generate and email dropoff OTP |
| `POST` | `/api/partner/bookings/otp/dropoff/verify` | Verify dropoff OTP, complete ride, calculate cash commission if needed |

### Chat

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/chat/send` | Persist a chat message |
| `GET` | `/api/chat/get-all?bookingId=...` | Fetch booking chat messages |
| `POST` | `/api/chat/ai-suggestions` | Generate three Gemini-based quick replies |

### Admin

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/admin/dashboard` | Dashboard counts and pending review lists |
| `GET` | `/api/admin/earning` | Admin commission earnings |
| `GET` | `/api/admin/reviews/partner/[id]` | Fetch partner review bundle |
| `PATCH` | `/api/admin/reviews/partner/[id]/approve` | Approve partner, documents, bank details, and queue video KYC |
| `PATCH` | `/api/admin/reviews/partner/[id]/reject` | Reject partner with reason |
| `GET` | `/api/admin/reviews/vehicle/[id]` | Fetch vehicle review details |
| `PATCH` | `/api/admin/reviews/vehicle/[id]/approve` | Approve vehicle |
| `PATCH` | `/api/admin/reviews/vehicle/[id]/reject` | Reject vehicle with reason |
| `GET` | `/api/admin/videoKyc/pending` | List pending video KYC partners |
| `GET` | `/api/admin/videoKyc/start/[id]` | Generate KYC room id and mark KYC in progress |
| `PATCH` | `/api/admin/videoKyc/complete` | Approve or reject KYC by room id |

## Realtime Server

The Socket.IO server runs from `glide-server/src/index.ts`.

### HTTP Endpoint

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/emit` | Emit an event to a specific user's current socket id |

Expected body:

```json
{
  "event": "new-booking",
  "userId": "mongodb-user-id",
  "data": {}
}
```

### Socket Events

| Event | Direction | Purpose |
| --- | --- | --- |
| `identity` | client to server | Store `socket.id`, mark user online |
| `watcher` | client to server | Update user's GeoJSON location |
| `join` | client to server | Join ride room `ride-{bookingId}` |
| `driver-location-update` | client to server | Broadcast live driver coordinates to ride room |
| `driver-location` | server to client | Receive driver coordinates |
| `chat-message` | client to server | Broadcast chat payload to ride room |
| `chat-msg` | server to client | Receive realtime chat payload |
| `new-booking` | server to partner | Notify partner of incoming booking |
| `accept-booking` | server to user | Notify user that partner accepted booking |
| `reject-booking` | server to user | Notify user that partner rejected booking |
| `disconnect` | client to server | Mark user offline and remove stored location |

## Database Models

### User

Stores account, role, verification, partner onboarding, KYC, socket, online state, and GeoJSON location.

Important fields:

- `role`: `user`, `partner`, `admin`
- `isEmailVerified`
- `steps`
- `partnerStatus`: `pending`, `approved`, `rejected`
- `videoKycStatus`: `not_required`, `pending`, `in_progress`, `approved`, `rejected`
- `socketId`
- `location` with `2dsphere` index
- `isOnline`

### Vehicle

Stores one vehicle per partner.

Important fields:

- `owner`
- `type`: `bike`, `car`, `loading`, `ev`, `truck`
- `vehicleModel`
- `number`
- `imageUrl`
- `baseFare`, `pricePerKM`, `waitingCharge`
- `status`: `approved`, `pending`, `rejected`
- `isActive`

### Booking

Stores ride request, locations, fare, payment, OTP, commission, and ride status.

Important fields:

- `user`, `driver`, `vehicle`
- `pickupAddress`, `dropoffAddress`
- `pickUpLocation`, `dropoffLocation` with `2dsphere` indexes
- `fare`
- `bookingStatus`: `idle`, `requested`, `awaiting_payment`, `confirmed`, `started`, `completed`, `cancelled`, `rejected`, `expired`
- `paymentStatus`: `pending`, `paid`, `cash`, `failed`
- `adminCommission`, `partnerAmount`
- `pickupOtp`, `dropoffOtp`

### Document

Stores partner document uploads.

Important fields:

- `owner`
- `aadharUrl`
- `rcUrl`
- `licenseUrl`
- `status`
- `rejectionReason`

### BankDetail

Stores partner payout information.

Important fields:

- `owner`
- `accountHolder`
- `accountNumber`
- `ifscCode`
- `upi`
- `status`: `not_added`, `added`, `verified`

### ChatMessage

Stores ride chat messages.

Important fields:

- `bookingId`
- `sender`: `user`, `driver`
- `text`

## Core Flows

### Authentication

1. User registers with name, email, and password.
2. Password is hashed with `bcryptjs`.
3. Six-digit OTP is emailed through Nodemailer.
4. User verifies OTP within five minutes.
5. Credentials login uses Auth.js JWT sessions.
6. Google login creates a user record when the email does not already exist.

### Booking

1. User selects pickup, dropoff, vehicle type, and mobile number.
2. Client asks `/api/nearby-vehicles` for approved online vehicles within 5 km.
3. User creates a booking through `/api/booking/create`.
4. Client API sends `new-booking` to the Socket.IO server's `/emit` endpoint.
5. Partner accepts or rejects the request.
6. User pays online through Razorpay or confirms with cash flow.
7. Ride progresses through pickup OTP, started state, dropoff OTP, and completed state.

### Partner Onboarding

1. Vehicle details are submitted and user role becomes `partner`.
2. Documents are uploaded to Cloudinary.
3. Bank, UPI, IFSC, and phone details are saved.
4. Admin reviews partner documents and bank information.
5. Admin starts video KYC, generating a secure room id.
6. Admin approves or rejects KYC.
7. Partner adds pricing and vehicle image.
8. Admin approves vehicle.
9. Partner becomes discoverable when online with an approved, active vehicle.

### Payments and Commission

- Razorpay order amount is based on `booking.fare * 100`.
- Signature verification uses `RAZORPAY_API_SECRET`.
- Online payment sets `paymentStatus=paid` and `bookingStatus=confirmed`.
- Admin commission is `10%` of fare.
- Partner amount is fare minus admin commission.
- Cash completion calculates the same commission during dropoff OTP verification.

### Realtime Location

1. Logged-in users initialize the socket through `GeoLocationUpdater`.
2. Client emits `identity` with the user id.
3. Partner/client location updates are emitted through `watcher`.
4. Server stores location in MongoDB as `[lng, lat]`.
5. Nearby vehicle search uses MongoDB `$near` with a `5000` meter max distance.
6. Active rides use ride rooms and `driver-location-update` for live tracking.

## Important Notes

- The project currently uses `.env` files inside both app directories.
- Route protection is implemented in `src/proxy.ts`.
- Public routes are limited; most pages and APIs require an Auth.js session.
- Admin-only routes check `session.user.role === "admin"`.
- Partner routes generally require the `partner` role, except onboarding pages.
- The client and realtime server both define a compatible `User` model because both write socket/location fields.
- `glide-client/.next`, `glide-client/node_modules`, `glide-server/dist`, and both `node_modules` folders are generated and should not be edited manually.

## Production Checklist

- Set strong `AUTH_SECRET` and `KYC_SECRET_SALT` values.
- Use production MongoDB, Razorpay, Cloudinary, Google OAuth, ZegoCloud, and Gemini credentials.
- Set `NEXT_BASE_URL` on the server to the deployed client URL.
- Set `NEXT_PUBLIC_SOCKET_SERVER_URL` on the client to the deployed realtime server URL.
- Confirm CORS allows only trusted client origins.
- Keep all secret values out of Git.
- Run `npm run build` in both apps before deployment.
