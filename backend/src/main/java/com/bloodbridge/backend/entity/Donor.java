package com.bloodbridge.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donors", indexes = {
    @Index(name = "idx_donors_matching", columnList = "blood_group, is_available"),
    @Index(name = "idx_donors_location", columnList = "latitude, longitude"),
    @Index(name = "idx_donors_city_state", columnList = "city, state")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false, length = 50)
    private BloodGroup bloodGroup;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @Column(name = "pincode", nullable = false, length = 10)
    private String pincode;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "preferred_radius_km", nullable = false)
    @Builder.Default
    private Integer preferredRadiusKm = 15;

    @Column(name = "total_donations_count", nullable = false)
    @Builder.Default
    private Integer totalDonationsCount = 0;

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
        if (isAvailable == null) {
            isAvailable = true;
        }
        if (preferredRadiusKm == null) {
            preferredRadiusKm = 15;
        }
        if (totalDonationsCount == null) {
            totalDonationsCount = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
