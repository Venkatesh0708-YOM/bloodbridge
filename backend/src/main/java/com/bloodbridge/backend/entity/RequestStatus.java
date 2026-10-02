package com.bloodbridge.backend.entity;

/**
 * Fulfillment lifecycle statuses for blood requests.
 */
public enum RequestStatus {
    OPEN,
    IN_PROGRESS,
    FULFILLED,
    EXPIRED,
    CANCELLED
}
