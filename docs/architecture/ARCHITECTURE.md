# BloodBridge System Architecture

## Overview
BloodBridge follows a classical multi-tier decoupled architecture separating client interface, application logic, and relational persistence.

```
+-------------------------------------------------------------+
|                      Client Layer                           |
|       Modular HTML5 / CSS3 / JavaScript (ES6 Modules)       |
+-------------------------------------------------------------+
                              |
                     HTTPS / JSON (REST)
                              |
+-------------------------------------------------------------+
|                    Application Layer                        |
|                  Spring Boot REST Backend                   |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Controller Layer (API endpoints, DTO mapping)         |  |
|  +-------------------------------------------------------+  |
|                             |                               |
|  +-------------------------------------------------------+  |
|  | Service Layer (Business rules, Matching calculations) |  |
|  +-------------------------------------------------------+  |
|                             |                               |
|  +-------------------------------------------------------+  |
|  | Repository Layer (Spring Data JPA / Hibernate)        |  |
|  +-------------------------------------------------------+  |
|                             |                               |
|  +-------------------------------------------------------+  |
|  | Security (JWT Token Filter, Role-Based Access)        |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
                              |
                       JDBC / HikariCP
                              |
+-------------------------------------------------------------+
|                     Persistence Layer                       |
|                   MySQL 8.0+ Database                       |
|         (Normalized Tables, Indexes, Constraints)           |
+-------------------------------------------------------------+
```

## Architectural Principles
1. **Layered Isolation**: Controllers handle request validation and response formatting. Business rules and algorithmic calculations reside strictly in Service components. Data access is encapsulated in Repositories.
2. **DTO Pattern**: Raw database entities are never returned directly over API responses to prevent accidental data leakage and tight coupling.
3. **Stateless Authentication**: JWT tokens are used for stateless request authorization across all protected endpoints.
4. **Privacy-by-Design**: Precise donor coordinates are kept strictly internal; public search queries return approximate distance and general vicinity to prevent sensitive data exposure.
