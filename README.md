# BloodBridge 🩸

> **Connecting Donors, Patients, and Blood Banks with Transparency and Speed.**

BloodBridge is a full-stack platform engineered to bridge critical communication gaps between individuals in urgent need of blood or blood components, nearby voluntary donors, and certified blood banks.

---

## 📌 Problem Statement

In many regions, blood donor networks and hospital blood-bank inventories are fragmented, heavily localized, and lack real-time visibility. When emergencies arise:
- Patient attenders struggle to identify matching voluntary donors nearby.
- Response times are prolonged due to manual phone inquiries and broadcast chains.
- Donors are contacted without regard to their donation eligibility interval or proximity.
- Blood bank stock levels remain opaque to requesters during critical hours.

## 💡 Proposed Solution

BloodBridge provides a centralized, transparent platform that connects four core stakeholders:
1. **Donors:** Register voluntary availability, track donation eligibility intervals, and respond to local needs.
2. **Requesters / Attenders:** Create urgent blood/component requests and discover verified nearby donors and blood banks.
3. **Blood Banks:** Maintain real-time inventory of blood components (Whole Blood, PRBC, Platelets, FFP, Cryoprecipitate).
4. **Admins:** Verify blood bank credentials, moderate platform records, and ensure data integrity.

> **Medical Disclaimer:** BloodBridge is a discovery and matching facilitator. It does **not** make medical eligibility determinations or clinical transfusion decisions. All donor suitability and cross-matching procedures must be conducted by certified healthcare professionals.

---

## 🏗️ Architecture & Technology Stack

```
[ Frontend: HTML5 / CSS3 / Vanilla JS (Modular ES6+) ]
                        │  (REST / JSON)
                        ▼
[ Backend: Java 17+ | Spring Boot 3.x | Spring Security (JWT) ]
     ├── Controller Layer (REST Endpoints & Validation)
     ├── Service Layer (Business Logic & Matching Engine)
     └── Data Access Layer (Spring Data JPA / Hibernate)
                        │
                        ▼
              [ Database: MySQL 8.0+ ]
```

### Stack Details
- **Frontend:** HTML5, CSS3 (Custom Responsive Layouts), Modular JavaScript (ES6+ Modules)
- **Backend:** Java 17+, Spring Boot 3.x, Spring Web, Spring Data JPA, Spring Security, JWT (JSON Web Tokens)
- **Database:** MySQL 8.0+ (Normalized schema with strict constraints and geospatial indexes)
- **Testing:** JUnit 5, Mockito, Postman
- **Build & Dependency Management:** Apache Maven

---

## 📁 Repository Structure

```
BloodBridge/
├── frontend/             # Modular web UI (HTML, CSS, JS)
│   ├── css/              # Stylesheets
│   ├── js/               # Modular JavaScript application code
│   └── index.html        # Landing page
├── backend/              # Spring Boot REST API application
│   └── src/              # Layered architecture (controller, service, repository, entity, dto)
├── database/             # MySQL schema migrations, DDL scripts, and seed data
│   ├── schema/           # Table definitions and migration scripts
│   └── seeds/            # Initial development seed datasets
├── docs/                 # Architecture, API specifications, and database documentation
│   ├── architecture/     # System architecture and sequence diagrams
│   ├── api/              # OpenAPI/REST endpoint specifications
│   └── database/         # ER diagrams and schema data dictionaries
├── .gitignore            # Git exclusion rules
├── LICENSE               # MIT License
└── README.md             # Project documentation
```

---

## 🗺️ 4-Week Development Roadmap

- [x] **Week 1 (Days 1–7):** Project Foundation, System Architecture, UI Prototypes & MySQL Schema Design
- [ ] **Week 2 (Days 8–14):** Spring Boot Backend Foundation, JWT Auth, Role-Based Access Control & User Profiles
- [ ] **Week 3 (Days 15–21):** Location-Based Matching Engine, Blood Bank Inventory & Donor Search
- [ ] **Week 4 (Days 22–28):** Emergency Mode Workflow, Notifications, Prioritization Engine, Integration Testing & Final Deployment

---

## 🚀 Getting Started (Development Setup)

### Prerequisites
- **Git** (v2.30+)
- **JDK 17** or later
- **Apache Maven** (v3.8+)
- **MySQL Server** (v8.0+)
- Modern Web Browser (Chrome, Firefox, Edge)

### Installation & Local Run
*(Detailed instructions will be expanded as backend and database layers are implemented in subsequent days.)*

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
