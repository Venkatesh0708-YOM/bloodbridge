package com.bloodbridge.backend.entity;

/**
 * Coordination and response lifecycle for potential donor matches.
 */
public enum MatchStatus {
    SUGGESTED,
    NOTIFIED,
    ACCEPTED,
    DECLINED,
    TIMEOUT,
    CANCELLED
}
