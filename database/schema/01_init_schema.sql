-- ============================================================================
-- BloodBridge Database Initialization Script (MySQL 8.0+)
-- Description: DDL schema definition for BloodBridge platform
-- Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS bloodbridge_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE bloodbridge_db;

-- ----------------------------------------------------------------------------
-- Table: users
-- Purpose: Central user authentication, base profile, and role-based access.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    role ENUM('DONOR', 'REQUESTER', 'BLOOD_BANK', 'ADMIN') NOT NULL,
    status ENUM('ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role_status (role, status),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: donors
-- Purpose: Donor-specific profile, availability status, and geocoded location.
-- Privacy Notice: Exact street addresses are omitted to preserve donor privacy.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    blood_group ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE') NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    last_donation_date DATE NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    preferred_radius_km INT NOT NULL DEFAULT 15,
    total_donations_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_donors_user_id FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_donors_matching (blood_group, is_available),
    INDEX idx_donors_location (latitude, longitude),
    INDEX idx_donors_city_state (city, state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: blood_banks
-- Purpose: Certified blood bank facility profile, licensing, and operational info.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blood_banks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    bank_name VARCHAR(200) NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    helpline_phone VARCHAR(20) NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    is_operational_24x7 BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_blood_banks_user_id FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_blood_banks_verification (verification_status),
    INDEX idx_blood_banks_location (latitude, longitude),
    INDEX idx_blood_banks_city_state (city, state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: blood_inventory
-- Purpose: Real-time stock tracked per blood bank by group and component.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blood_inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    blood_bank_id BIGINT NOT NULL,
    blood_group ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE') NOT NULL,
    blood_component ENUM('WHOLE_BLOOD', 'PACKED_RED_BLOOD_CELLS', 'PLATELETS', 'FRESH_FROZEN_PLASMA', 'CRYOPRECIPITATE') NOT NULL,
    available_units INT NOT NULL DEFAULT 0,
    last_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_blood_inventory_bank_id FOREIGN KEY (blood_bank_id) 
        REFERENCES blood_banks (id) ON DELETE CASCADE,
    CONSTRAINT uq_blood_bank_group_component UNIQUE (blood_bank_id, blood_group, blood_component),
    CONSTRAINT chk_available_units CHECK (available_units >= 0),
    INDEX idx_inventory_lookup (blood_group, blood_component, available_units)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: blood_requests
-- Purpose: Blood and component requests created by patient attenders / requesters.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blood_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    blood_group ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE') NOT NULL,
    blood_component ENUM('WHOLE_BLOOD', 'PACKED_RED_BLOOD_CELLS', 'PLATELETS', 'FRESH_FROZEN_PLASMA', 'CRYOPRECIPITATE') NOT NULL,
    units_required INT NOT NULL,
    hospital_name VARCHAR(200) NOT NULL,
    hospital_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    urgency_level ENUM('NORMAL', 'URGENT', 'CRITICAL_EMERGENCY') NOT NULL DEFAULT 'NORMAL',
    status ENUM('OPEN', 'IN_PROGRESS', 'FULFILLED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    required_within_hours INT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_blood_requests_requester_id FOREIGN KEY (requester_id) 
        REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT chk_units_required CHECK (units_required > 0),
    INDEX idx_requests_status_group (status, blood_group),
    INDEX idx_requests_urgency (urgency_level),
    INDEX idx_requests_location (latitude, longitude),
    INDEX idx_requests_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: request_matches
-- Purpose: Stores algorithmic match results between blood requests and potential donors.
-- Disclaimer: matching_score is an application-level ranking score, NOT a medical decision.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS request_matches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL,
    donor_id BIGINT NOT NULL,
    distance_km DECIMAL(6, 2) NOT NULL,
    matching_score DECIMAL(5, 2) NOT NULL COMMENT 'Application heuristic ranking score (0-100)',
    match_status ENUM('SUGGESTED', 'NOTIFIED', 'ACCEPTED', 'DECLINED', 'TIMEOUT', 'CANCELLED') NOT NULL DEFAULT 'SUGGESTED',
    donor_response_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_matches_request_id FOREIGN KEY (request_id) 
        REFERENCES blood_requests (id) ON DELETE CASCADE,
    CONSTRAINT fk_matches_donor_id FOREIGN KEY (donor_id) 
        REFERENCES donors (id) ON DELETE CASCADE,
    CONSTRAINT uq_request_donor_match UNIQUE (request_id, donor_id),
    INDEX idx_matches_request_status (request_id, match_status),
    INDEX idx_matches_donor_status (donor_id, match_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: notifications
-- Purpose: Transactional and event-driven notifications for all users.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    related_request_id BIGINT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('DONOR_REQUEST_ALERT', 'REQUEST_STATUS_UPDATE', 'DONOR_ACCEPTED', 'BLOOD_BANK_ALERT', 'SYSTEM_ANNOUNCEMENT') NOT NULL,
    channel ENUM('IN_APP', 'EMAIL', 'SMS') NOT NULL DEFAULT 'IN_APP',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_request_id FOREIGN KEY (related_request_id) 
        REFERENCES blood_requests (id) ON DELETE SET NULL,
    INDEX idx_notifications_user_read (user_id, is_read),
    INDEX idx_notifications_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table: audit_logs
-- Purpose: Administrative and compliance event tracking.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id BIGINT NULL,
    ip_address VARCHAR(45) NULL,
    details JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_logs_user_id FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_audit_logs_entity (entity_name, entity_id),
    INDEX idx_audit_logs_user (user_id),
    INDEX idx_audit_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
