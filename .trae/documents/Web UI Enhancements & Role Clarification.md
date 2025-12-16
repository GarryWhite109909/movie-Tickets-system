I have analyzed the user's feedback and the codebase. Here is the plan to address the issues:

### 1. Issue: "Login" button on Hero section not disappearing after login
**Root Cause**: The Home Page (`app/page.tsx`) is a Server Component, but the auth state (`localStorage`) is client-side. Server components cannot access `localStorage`.
**Solution**:
*   Create a Client Component `components/HeroSection.tsx` that wraps the hero content.
*   Move the "Login" button logic into this client component, which will check `auth.getUser()` to conditionally render the button.
*   Update `app/page.tsx` to use this new component.

### 2. Issue: Empty/Boring "Hot Recommendations" (`<p>` tag)
**Root Cause**: When no top films are returned (e.g., no booking data yet), it shows a simple `<p>暂无热门推荐</p>`.
**Solution**:
*   Update `app/page.tsx` (or extract to `components/TopFilms.tsx`) to show a "Coming Soon" placeholder or fallback to showing the latest films instead of empty state.
*   Add a "Mock Data" fallback if the API returns empty, just for better visual presentation during development.

### 3. Issue: Non-clickable Genre Spans (`span`)
**Root Cause**: The genre tags (Action, Sci-Fi, etc.) are static `<span>` elements.
**Solution**:
*   Create a Client Component `components/FilmFilter.tsx`.
*   Implement click handlers that redirect to `/films?genre=Action` or filter the list locally (if on the films page). For the home page, redirecting to the films listing with a query param is best.

### 4. Issue: "Cumulative Orders" card redirects to `/films`
**Root Cause**: The card is wrapped in `<Link href="/films">`.
**Solution**:
*   Update the link to point to `/profile?tab=orders` (User's order history).
*   **Prerequisite**: We need a `/profile` page. I will create a basic User Profile page structure.

### 5. Issue: Role-based Interfaces
**User Question**: "Shouldn't different roles have different interfaces?"
**Analysis**:
*   **Web Frontend (`web-new`)**: Primarily for **Consumers** (C-end users).
*   **Admin Frontend (`admin-new`)**: For **Staff/Admins** (Cinema Admin, Finance, Operator, Super Admin).
*   **Clarification**: I need to explain to the user that we *do* have separate systems.
    *   `localhost:3000` -> Consumer (Ticket Buying)
    *   `localhost:5173` -> Management (Cinema, Finance, Ops)
*   **Action**:
    *   I will not merge them into one UI because that complicates security and UX.
    *   Instead, I will add a "Management Portal" link in the footer or header of the Web Frontend (visible only if the user has specific roles, or just a static link "Admin Login").
    *   In the `Admin` project, I will ensure the sidebar menu filters based on permissions (already partially implemented in `RoleEdit`, but `Layout` needs to check permissions). *For this turn, I will focus on the user's specific request about the Web UI.*

### Implementation Steps
1.  **Create `components/HeroSection.tsx`**: Client component with login-aware buttons.
2.  **Create `components/FilmFilter.tsx`**: Client component for genre tags.
3.  **Create `app/profile/page.tsx`**: Basic user profile page (placeholder for Orders).
4.  **Refactor `app/page.tsx`**: Integrate the new components and fix the Order link.
5.  **Explain Role Architecture**: Provide a clear explanation in the final response.

I will use `nextjs-app-router-expert` to implement the code changes.
