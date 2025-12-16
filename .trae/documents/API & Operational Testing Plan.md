I have inspected the configuration files and prepared a plan for comprehensive API and operational testing.

### Configuration Status
*   **Backend Port**: 3003 (from `server-nest/.env`)
*   **Web Frontend API URL**: `http://localhost:3003/api` (from `web-new/utils/api.ts`)
*   **Admin Frontend API URL**: `/api` (from `admin-new/src/utils/request.ts`). **Potential Issue**: This relative path requires a proxy in `vite.config.ts` to forward `/api` to `http://localhost:3003/api` or `http://localhost:3003`. I will instruct the tester to verify this.

### Testing Plan
I will engage the **API Integration Tester** agent to perform the following:

1.  **Environment Health Check**:
    *   Verify Backend is running on port 3003.
    *   Verify Admin Frontend proxy configuration in `vite.config.ts`.

2.  **Automated API Testing (Scripted)**:
    *   Create and run a test script (`scripts/api-test.ts`) to hit all endpoints defined in `API_DOCUMENTATION.md`.
    *   **Test Cases**:
        *   `POST /api/web/login` (User Login) -> Expect Token.
        *   `POST /api/login` (Admin Login) -> Expect Token.
        *   `GET /api/film/all` -> Expect List.
        *   `GET /api/cinema/room/list` -> Expect List.
        *   `GET /api/system/role/list` -> Expect List.

3.  **Operational Flow Verification**:
    *   Verify the "Register -> Login -> View Film" flow (simulated).
    *   Verify the "Admin Login -> Create Film -> View in Web" flow (simulated).

4.  **Issue Reporting & Delegation**:
    *   If backend fails (e.g., 500 Error) -> Assign to `NestJS Architect`.
    *   If Web fails (e.g., connection refused) -> Assign to `Next.js Expert`.
    *   If Admin fails (e.g., 404 on /api) -> Assign to `React Vite Engineer`.

I will now start the testing process.
