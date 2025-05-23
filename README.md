# Calendar Web Application

A simplified Java web calendar application with RESTful API built using Spring Boot.

## Features

- User management with three different user roles (Admin, Manager, User)
- Calendar management with sharing capabilities
- Event management with date-range queries
- RESTful API with JWT authentication

## Prerequisites

- Java 11
- Maven 3.6 or higher

## How to Run

1. Make sure you have Java 11 and Maven installed
2. Navigate to the project directory (`calendar-app`)
3. Run the application:

```shell
mvn spring-boot:run
```

The application will be available at http://localhost:8081

## H2 Database Console

The application uses an in-memory H2 database. You can access the H2 console at http://localhost:8081/h2-console with these credentials:

- JDBC URL: `jdbc:h2:mem:calendardb`
- Username: `sa`
- Password: `password`

## API Endpoints

The application provides REST API endpoints for:
- Authentication (/api/auth/*) 
- Users (/api/users/*)
- Calendars (/api/calendars/*)
- Events (/api/events/*)

Users can have one of three roles (ADMIN, MANAGER, USER) with different access levels. 