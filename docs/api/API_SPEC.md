# BloodBridge API Specification Draft

## API Conventions
- **Base URL:** `/api/v1`
- **Content-Type:** `application/json`
- **Authentication:** `Authorization: Bearer <JWT_TOKEN>`

## Planned Endpoints Overview

### 1. Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` - Register a new user (DONOR, REQUESTER, BLOOD_BANK)
- `POST /api/v1/auth/login` - Authenticate and return JWT token
- `POST /api/v1/auth/refresh` - Refresh active JWT session

### 2. Donors (`/api/v1/donors`)
- `GET /api/v1/donors/profile` - Get authenticated donor's full profile
- `PUT /api/v1/donors/profile` - Update donor preferences, availability, last donation date
- `PUT /api/v1/donors/status` - Toggle donor active availability flag

### 3. Blood Requests (`/api/v1/requests`)
- `POST /api/v1/requests` - Create a new blood or component request
- `GET /api/v1/requests/{id}` - Fetch request details
- `GET /api/v1/requests/{id}/matches` - Execute matching engine to discover nearby compatible donors
- `PATCH /api/v1/requests/{id}/status` - Update request status (OPEN, FULFILLED, CANCELLED)

### 4. Blood Banks (`/api/v1/blood-banks`)
- `GET /api/v1/blood-banks` - Search blood banks by location and component availability
- `GET /api/v1/blood-banks/{id}/inventory` - View inventory stock levels for a specific blood bank
- `PUT /api/v1/blood-banks/{id}/inventory` - Update stock quantities

### 5. Admin (`/api/v1/admin`)
- `GET /api/v1/admin/users` - View and manage user accounts
- `PATCH /api/v1/admin/blood-banks/{id}/verify` - Verify blood bank accreditation
- `GET /api/v1/admin/metrics` - Fetch platform activity metrics
