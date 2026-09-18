# BloodBridge Data Dictionary

This document details every table, column, data type, nullability, constraint, and default value for the BloodBridge MySQL database schema.

---

## 1. Table: `users`
Central user registry for all roles (`DONOR`, `REQUESTER`, `BLOOD_BANK`, `ADMIN`).

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | AUTO_INCREMENT | `PRIMARY KEY` | Unique user identifier |
| `email` | `VARCHAR(255)` | NO | None | `UNIQUE` | User login email address |
| `password_hash` | `VARCHAR(255)` | NO | None | None | BCrypt password hash |
| `full_name` | `VARCHAR(150)` | NO | None | None | Legal name of user or contact representative |
| `phone_number` | `VARCHAR(20)` | NO | None | `UNIQUE` | E.164 formatted phone number for SMS/alerts |
| `role` | `ENUM` | NO | None | `'DONOR', 'REQUESTER', 'BLOOD_BANK', 'ADMIN'` | Access control role |
| `status` | `ENUM` | NO | `'ACTIVE'` | `'ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'DEACTIVATED'` | Account lifecycle state |
| `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | None | Registration timestamp |
| `updated_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | None | Last update timestamp |

**Indexes:**
- `PRIMARY KEY (id)`
- `UNIQUE KEY uq_users_email (email)`
- `UNIQUE KEY uq_users_phone (phone_number)`
- `INDEX idx_users_role_status (role, status)`

---

## 2. Table: `donors`
Extended profile for voluntary blood donors.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | AUTO_INCREMENT | `PRIMARY KEY` | Unique donor profile identifier |
| `user_id` | `BIGINT` | NO | None | `UNIQUE`, `FK -> users(id) ON DELETE CASCADE` | 1-to-1 link to user record |
| `blood_group` | `ENUM` | NO | None | `'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'` | Donor blood group |
| `is_available` | `BOOLEAN` | NO | `TRUE` | None | Availability flag for receiving match alerts |
| `last_donation_date` | `DATE` | YES | `NULL` | None | Date of most recent whole blood/component donation |
| `city` | `VARCHAR(100)` | NO | None | None | Residential city |
| `state` | `VARCHAR(100)` | NO | None | None | Residential state |
| `pincode` | `VARCHAR(10)` | NO | None | None | Postal code for coarse location queries |
| `latitude` | `DECIMAL(10, 7)` | NO | None | None | Latitude coordinate for proximity calculation |
| `longitude` | `DECIMAL(10, 7)` | NO | None | None | Longitude coordinate for proximity calculation |
| `preferred_radius_km` | `INT` | NO | `15` | None | Maximum travel distance in km for donation requests |
| `total_donations_count`| `INT` | NO | `0` | None | Lifetime verified donation count |
| `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | None | Profile creation timestamp |
| `updated_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | None | Last profile update timestamp |

**Indexes:**
- `PRIMARY KEY (id)`
- `UNIQUE KEY uq_donors_user_id (user_id)`
- `INDEX idx_donors_matching (blood_group, is_available)`
- `INDEX idx_donors_location (latitude, longitude)`
- `INDEX idx_donors_city_state (city, state)`

---

## 3. Table: `blood_banks`
Licensed blood bank facilities and verification status.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | AUTO_INCREMENT | `PRIMARY KEY` | Unique blood bank profile identifier |
| `user_id` | `BIGINT` | NO | None | `UNIQUE`, `FK -> users(id) ON DELETE CASCADE` | 1-to-1 link to user credentials |
| `bank_name` | `VARCHAR(200)` | NO | None | None | Official registered name of blood bank |
| `license_number` | `VARCHAR(100)` | NO | None | `UNIQUE` | Government regulatory license number |
| `contact_email` | `VARCHAR(255)` | NO | None | None | Operational email address |
| `contact_phone` | `VARCHAR(20)` | NO | None | None | Direct landline/mobile number |
| `helpline_phone` | `VARCHAR(20)` | YES | `NULL` | None | 24/7 emergency contact number |
| `address_line1` | `VARCHAR(255)` | NO | None | None | Facility street address |
| `address_line2` | `VARCHAR(255)` | YES | `NULL` | None | Landmark / Suite / Floor |
| `city` | `VARCHAR(100)` | NO | None | None | City location |
| `state` | `VARCHAR(100)` | NO | None | None | State location |
| `pincode` | `VARCHAR(10)` | NO | None | None | Postal code |
| `latitude` | `DECIMAL(10, 7)` | NO | None | None | Facility latitude coordinate |
| `longitude` | `DECIMAL(10, 7)` | NO | None | None | Facility longitude coordinate |
| `verification_status` | `ENUM` | NO | `'PENDING'` | `'PENDING', 'VERIFIED', 'REJECTED'` | Admin accreditation status |
| `is_operational_24x7`| `BOOLEAN` | NO | `FALSE` | None | 24/7 emergency dispatch capability |
| `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | None | Registration timestamp |
| `updated_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | None | Profile update timestamp |

**Indexes:**
- `PRIMARY KEY (id)`
- `UNIQUE KEY uq_blood_banks_user_id (user_id)`
- `UNIQUE KEY uq_blood_banks_license (license_number)`
- `INDEX idx_blood_banks_verification (verification_status)`
- `INDEX idx_blood_banks_location (latitude, longitude)`
- `INDEX idx_blood_banks_city_state (city, state)`

---

## 4. Table: `blood_inventory`
Component-wise inventory units managed by blood banks.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | AUTO_INCREMENT | `PRIMARY KEY` | Unique inventory record identifier |
| `blood_bank_id` | `BIGINT` | NO | None | `FK -> blood_banks(id) ON DELETE CASCADE` | Associated blood bank |
| `blood_group` | `ENUM` | NO | None | Standard 8 blood groups | Component blood group |
| `blood_component` | `ENUM` | NO | None | `'WHOLE_BLOOD', 'PACKED_RED_BLOOD_CELLS', 'PLATELETS', 'FRESH_FROZEN_PLASMA', 'CRYOPRECIPITATE'` | Component type |
| `available_units` | `INT` | NO | `0` | `CHECK (available_units >= 0)` | Quantity in stock units |
| `last_updated_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | None | Last inventory adjustment timestamp |

**Constraints & Indexes:**
- `PRIMARY KEY (id)`
- `UNIQUE KEY uq_blood_bank_group_component (blood_bank_id, blood_group, blood_component)`
- `INDEX idx_inventory_lookup (blood_group, blood_component, available_units)`

---

## 5. Table: `blood_requests`
Requests created by patients or hospital attenders.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | AUTO_INCREMENT | `PRIMARY KEY` | Unique request identifier |
| `requester_id` | `BIGINT` | NO | None | `FK -> users(id) ON DELETE RESTRICT` | User who submitted request |
| `patient_name` | `VARCHAR(150)` | NO | None | None | Name of the patient |
| `blood_group` | `ENUM` | NO | None | Standard 8 blood groups | Required blood group |
| `blood_component` | `ENUM` | NO | None | 5 component types | Required blood component |
| `units_required` | `INT` | NO | None | `CHECK (units_required > 0)` | Quantity of units needed |
| `hospital_name` | `VARCHAR(200)` | NO | None | None | Hospital or treatment center name |
| `hospital_address`| `VARCHAR(255)` | NO | None | None | Address of hospital facility |
| `city` | `VARCHAR(100)` | NO | None | None | Hospital city |
| `state` | `VARCHAR(100)` | NO | None | None | Hospital state |
| `pincode` | `VARCHAR(10)` | NO | None | None | Hospital postal code |
| `latitude` | `DECIMAL(10, 7)` | NO | None | None | Hospital latitude coordinate |
| `longitude` | `DECIMAL(10, 7)` | NO | None | None | Hospital longitude coordinate |
| `urgency_level` | `ENUM` | NO | `'NORMAL'` | `'NORMAL', 'URGENT', 'CRITICAL_EMERGENCY'` | Urgency classification |
| `status` | `ENUM` | NO | `'OPEN'` | `'OPEN', 'IN_PROGRESS', 'FULFILLED', 'EXPIRED', 'CANCELLED'` | Lifecycle status |
| `required_within_hours`| `INT` | YES | `NULL` | None | Time window (hours) for required delivery |
| `notes` | `TEXT` | YES | `NULL` | None | Additional hospital / doctor instructions |
| `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | None | Submission timestamp |
| `updated_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | None | Status update timestamp |

**Indexes:**
- `PRIMARY KEY (id)`
- `INDEX idx_requests_status_group (status, blood_group)`
- `INDEX idx_requests_urgency (urgency_level)`
- `INDEX idx_requests_location (latitude, longitude)`
- `INDEX idx_requests_created_at (created_at)`

---

## 6. Table: `request_matches`
Algorithmic potential matches computed between a blood request and nearby donors.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | AUTO_INCREMENT | `PRIMARY KEY` | Unique match identifier |
| `request_id` | `BIGINT` | NO | None | `FK -> blood_requests(id) ON DELETE CASCADE` | Associated request |
| `donor_id` | `BIGINT` | NO | None | `FK -> donors(id) ON DELETE CASCADE` | Matched donor candidate |
| `distance_km` | `DECIMAL(6, 2)` | NO | None | None | Distance from hospital to donor in km |
| `matching_score`| `DECIMAL(5, 2)`| NO | None | None | Heuristic score (0.00 to 100.00) based on distance, availability, interval |
| `match_status` | `ENUM` | NO | `'SUGGESTED'`| `'SUGGESTED', 'NOTIFIED', 'ACCEPTED', 'DECLINED', 'TIMEOUT', 'CANCELLED'` | Match state |
| `donor_response_at`| `TIMESTAMP` | YES | `NULL` | None | Timestamp when donor accepted/declined |
| `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | None | Computation timestamp |
| `updated_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | None | State update timestamp |

**Constraints & Indexes:**
- `PRIMARY KEY (id)`
- `UNIQUE KEY uq_request_donor_match (request_id, donor_id)`
- `INDEX idx_matches_request_status (request_id, match_status)`
- `INDEX idx_matches_donor_status (donor_id, match_status)`

---

## 7. Table: `notifications`
In-app and outgoing notification records.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | AUTO_INCREMENT | `PRIMARY KEY` | Unique notification identifier |
| `user_id` | `BIGINT` | NO | None | `FK -> users(id) ON DELETE CASCADE` | Recipient user |
| `related_request_id`| `BIGINT`| YES | `NULL` | `FK -> blood_requests(id) ON DELETE SET NULL` | Optional associated request |
| `title` | `VARCHAR(200)` | NO | None | None | Notification subject line |
| `message` | `TEXT` | NO | None | None | Detailed notification content |
| `notification_type` | `ENUM` | NO | None | `'DONOR_REQUEST_ALERT', 'REQUEST_STATUS_UPDATE', 'DONOR_ACCEPTED', 'BLOOD_BANK_ALERT', 'SYSTEM_ANNOUNCEMENT'` | Event category |
| `channel` | `ENUM` | NO | `'IN_APP'` | `'IN_APP', 'EMAIL', 'SMS'` | Target delivery channel |
| `is_read` | `BOOLEAN` | NO | `FALSE` | None | Read flag |
| `read_at` | `TIMESTAMP` | YES | `NULL` | None | Read timestamp |
| `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | None | Creation timestamp |

**Indexes:**
- `PRIMARY KEY (id)`
- `INDEX idx_notifications_user_read (user_id, is_read)`
- `INDEX idx_notifications_created_at (created_at)`

---

## 8. Table: `audit_logs`
System compliance and activity logging.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | NO | AUTO_INCREMENT | `PRIMARY KEY` | Unique log entry identifier |
| `user_id` | `BIGINT` | YES | `NULL` | `FK -> users(id) ON DELETE SET NULL` | Actor user ID |
| `action` | `VARCHAR(100)` | NO | None | None | Action identifier (e.g. `LOGIN`, `UPDATE_INVENTORY`) |
| `entity_name` | `VARCHAR(100)` | NO | None | None | Affected entity (e.g. `blood_inventory`) |
| `entity_id` | `BIGINT` | YES | `NULL` | None | ID of affected entity row |
| `ip_address` | `VARCHAR(45)` | YES | `NULL` | None | Client IP address (IPv4/IPv6) |
| `details` | `JSON` | YES | `NULL` | None | Structured payload / metadata |
| `created_at` | `TIMESTAMP` | NO | `CURRENT_TIMESTAMP` | None | Timestamp of event |

**Indexes:**
- `PRIMARY KEY (id)`
- `INDEX idx_audit_logs_entity (entity_name, entity_id)`
- `INDEX idx_audit_logs_user (user_id)`
- `INDEX idx_audit_logs_created_at (created_at)`
