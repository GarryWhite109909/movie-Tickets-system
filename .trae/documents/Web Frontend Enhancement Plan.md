I have analyzed the current state of the Web Frontend (`web-new`) and the Backend API.

### Task Analysis
1.  **Backend Status**: Supports Film listing/details (`/api/film/all`, `/api/film/:id`) and Login (`/api/web/login`). Registration and Booking APIs are missing.
2.  **Web Frontend Status**: Has Home, Films list, and Login.
3.  **Missing Web Features**:
    *   **Film Detail Page**: Needs to be implemented to show film info (using `/api/film/:id`).
    *   **Registration Page**: UI needed, but backend support is missing. I will instruct the agent to create the UI and mock the API call or note the missing endpoint.
    *   **User Center**: UI needed (e.g., Profile), but Orders API is missing.

### Plan
1.  **Create `NEXTJS_TASKS.md`**: This document will guide the `nextjs-app-router-expert` agent.
    *   **Goal**: Polish the user experience and implement missing read-only pages.
    *   **Task 1: Film Detail Page (`app/films/[id]/page.tsx`)**. Fetch data from `/api/film/:id` and display poster, director, cast, intro. Add a "Buy Ticket" button (disabled or alerting "Coming Soon").
    *   **Task 2: Registration Page (`app/register/page.tsx`)**. Create a form (username, password, phone). Since backend API is missing, mock the success state or comment out the API call.
    *   **Task 3: User Profile Dropdown**. Update `Header.tsx` to show a dropdown for "My Profile" / "Logout" when logged in.

2.  **Execute Agent**: Call `nextjs-app-router-expert` to execute the tasks in `NEXTJS_TASKS.md`.

3.  **Contingency**: If the agent finds no work (unlikely given the above), the instructions allow falling back to the `api-integration-tester`. However, I will explicitly assign the frontend tasks to ensure progress.
