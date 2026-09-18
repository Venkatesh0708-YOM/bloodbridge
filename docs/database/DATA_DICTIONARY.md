# BloodBridge Database Design & Data Dictionary Draft

## Database Specifications
- **Engine:** MySQL 8.0+ (InnoDB)
- **Charset / Collation:** `utf8mb4 / utf8mb4_unicode_ci`

## Core Entities Planned

1. **`users`**: Base credentials and role management (`DONOR`, `REQUESTER`, `BLOOD_BANK`, `ADMIN`).
2. **`donors`**: Profile details for voluntary blood donors (blood group, availability, last donation date, location coordinates).
3. **`blood_banks`**: Facility details, license/verification status, contact and address.
4. **`blood_inventory`**: Real-time stock tracked per blood bank by blood group and component type (Whole Blood, PRBC, Platelets, FFP, etc.).
5. **`blood_requests`**: Requests created by requesters/attenders (patient name, blood group, component, units needed, hospital location, urgency level, status).
6. **`request_responses`**: Donor/Blood Bank responses and commitments to individual requests.
7. **`audit_logs` / `notifications`**: Transactional history and communication logs.
