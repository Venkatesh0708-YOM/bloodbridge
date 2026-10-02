package com.bloodbridge.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_inventory",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_blood_bank_group_component", columnNames = {"blood_bank_id", "blood_group", "blood_component"})
    },
    indexes = {
        @Index(name = "idx_inventory_lookup", columnList = "blood_group, blood_component, available_units")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_bank_id", nullable = false)
    private BloodBank bloodBank;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false, length = 50)
    private BloodGroup bloodGroup;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_component", nullable = false, length = 50)
    private BloodComponent bloodComponent;

    @Column(name = "available_units", nullable = false)
    @Builder.Default
    private Integer availableUnits = 0;

    @Column(name = "last_updated_at", nullable = false)
    private LocalDateTime lastUpdatedAt;

    @PrePersist
    protected void onCreate() {
        if (lastUpdatedAt == null) {
            lastUpdatedAt = LocalDateTime.now();
        }
        if (availableUnits == null) {
            availableUnits = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdatedAt = LocalDateTime.now();
    }
}
