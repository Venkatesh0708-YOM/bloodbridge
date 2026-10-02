package com.bloodbridge.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests", indexes = {
    @Index(name = "idx_requests_status_group", columnList = "status, blood_group"),
    @Index(name = "idx_requests_urgency", columnList = "urgency_level"),
    @Index(name = "idx_requests_location", columnList = "latitude, longitude"),
    @Index(name = "idx_requests_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @Column(name = "patient_name", nullable = false, length = 150)
    private String patientName;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false, length = 50)
    private BloodGroup bloodGroup;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_component", nullable = false, length = 50)
    private BloodComponent bloodComponent;

    @Column(name = "units_required", nullable = false)
    private Integer unitsRequired;

    @Column(name = "hospital_name", nullable = false, length = 200)
    private String hospitalName;

    @Column(name = "hospital_address", nullable = false, length = 255)
    private String hospitalAddress;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level", nullable = false, length = 50)
    @Builder.Default
    private UrgencyLevel urgencyLevel = UrgencyLevel.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private RequestStatus status = RequestStatus.OPEN;

    @Column(name = "required_within_hours")
    private Integer requiredWithinHours;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

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
        if (urgencyLevel == null) {
            urgencyLevel = UrgencyLevel.NORMAL;
        }
        if (status == null) {
            status = RequestStatus.OPEN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
