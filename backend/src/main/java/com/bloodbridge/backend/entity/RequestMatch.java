package com.bloodbridge.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "request_matches",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_request_donor_match", columnNames = {"request_id", "donor_id"})
    },
    indexes = {
        @Index(name = "idx_matches_request_status", columnList = "request_id, match_status"),
        @Index(name = "idx_matches_donor_status", columnList = "donor_id, match_status")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private BloodRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @Column(name = "distance_km", nullable = false, precision = 6, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "matching_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal matchingScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "match_status", nullable = false, length = 50)
    @Builder.Default
    private MatchStatus matchStatus = MatchStatus.SUGGESTED;

    @Column(name = "donor_response_at")
    private LocalDateTime donorResponseAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (matchStatus == null) {
            matchStatus = MatchStatus.SUGGESTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
