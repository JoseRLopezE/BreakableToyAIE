# Breakable Toy Project

## Overview
The Breakable Toy project is a full-stack inventory management dashboard with a Spring Boot backend and a React 19 + TypeScript frontend. The project demonstrates robust business logic, modern async UX, accessibility, and comprehensive testing. AI (GitHub Copilot) was utilized to automate and improve development, testing, and documentation.

## Project Structure
```
BreakableToy
├── backend
│   ├── src
│   │   └── main
│   │       ├── java
│   │       │   └── com
│   │       │       └── breakabletoy
│   │       │           ├── Application.java
│   │       │           ├── controller
│   │       │           │   └── ProductController.java
│   │       │           ├── model
│   │       │           │   └── Product.java
│   │       │           ├── repository
│   │       │           │   └── ProductRepository.java
│   │       │           └── service
│   │       │               └── ProductService.java
│   │       │
│   │       └── resources
│   │           ├── application.properties
│   │           └── static
│   │               ├── assets
│   │               └── index.html
│   ├── pom.xml
│   └── README.md
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   └── Metrics.tsx
│   │   ├── services
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   └── styles.css
│   ├── public
│   │   └── index.html
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## Backend Setup
1. Navigate to the `backend` directory.
2. Ensure you have Java 17+ and Maven installed.
3. Run the following command to start the Spring Boot application:
   ```sh
   mvn spring-boot:run
   ```
4. The backend will be available at [http://localhost:9090](http://localhost:9090).

## Frontend Setup
1. Navigate to the `frontend` directory.
2. Ensure you have Node.js and npm installed.
3. Install the dependencies by running:
   ```sh
   npm install
   ```
4. Start the React application with:
   ```sh
   npm run dev
   ```
5. The frontend will be available at [http://localhost:8080](http://localhost:8080).

## Features
- Product CRUD with modal forms
- Category, search, and availability filtering (backend-driven)
- Sorting and pagination (backend-driven)
- Metrics dashboard (fetched from backend)
- Robust error handling for all API calls
- Async save UX: Save button disables and shows 'Saving...' while saving
- Accessible UI (aria-labels, keyboard navigation)
- Comprehensive integration and component tests (Vitest + Testing Library)

## Testing
- Run all frontend tests:
  ```sh
  npm run test
  ```
- Run all backend tests:
  ```sh
  mvn test
  ```
- Tests cover integration, API, and all major UI flows.

## Troubleshooting
- **Metrics not loading / 500 error:**
  - Ensure the backend is running and port 9090 is free.
  - If you see a 500 error on `/api/products/metrics`, make sure the backend DTOs have public no-arg constructors and Jackson annotations (see `MetricsResponse.java`).
  - Restart the backend after any DTO changes.
- **Frontend Save button stuck on 'Saving...':**
  - This means the save API call failed. Check the error message at the top of the page and ensure the backend is reachable.

## Accessibility
- All form fields and buttons have accessible labels.
- Modal and table actions are keyboard accessible.

## AI Involvement
- GitHub Copilot was used to automate migrations, refactorings, and test generation.
- Refer to `TECHNICAL_LOG` for a detailed log of AI-assisted improvements and code examples.

