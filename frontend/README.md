# React + TypeScript + Vite

This project is a modern inventory management dashboard with a React 19 frontend and a Spring Boot backend.

> **Note:** AI (Copilot) was utilized to make improvements.

## Features
- Product CRUD with modal forms
- Category, search, and availability filtering
- Sorting and pagination
- Metrics dashboard (fetched from backend)
- Robust error handling for all API calls
- Async save UX: Save button disables and shows 'Saving...' while saving
- Accessible UI (aria-labels, keyboard navigation)
- Comprehensive integration and component tests (Vitest + Testing Library)

## Setup

### Backend
1. Navigate to the `backend` directory.
2. Ensure Java 17+ and Maven are installed.
3. Start the backend:
   ```sh
   mvn spring-boot:run
   ```
4. The backend runs at [http://localhost:9090](http://localhost:9090).

### Frontend
1. Navigate to the `frontend` directory.
2. Ensure Node.js and npm are installed.
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```
5. The frontend runs at [http://localhost:8080](http://localhost:8080).

## Testing
- Run all frontend tests:
  ```sh
  npm run test
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

## License
MIT
