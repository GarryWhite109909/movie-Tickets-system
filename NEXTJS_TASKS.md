# Next.js Web Frontend Tasks

## Overview
The backend API (`server-nest`) provides endpoints for Film listing, Film details, and User Login. The current Web Frontend (`web-new`) has a Home page and a basic Film list.
Your task is to implement the missing "Film Detail" page and "Registration" page to improve the user experience.

## Base URL
All API requests should go to `/api` (proxied to backend).

## Tasks

### 1. Film Detail Page (`app/films/[id]/page.tsx`)
**Goal**: Show detailed information about a specific film.
*   **Route**: `/films/[id]` (Dynamic Route)
*   **Data Fetching**:
    *   Fetch data from `/api/film/:id` (e.g., `/api/film/1`).
    *   Response format: `{ code: 1, data: { filmName, englishName, introduction, directors, performers, filmTime, onTime, poster } }`.
*   **UI Requirements**:
    *   Display the **Poster** (large, high quality).
    *   Display **Title** (Film Name) and **English Title**.
    *   Display **Metadata**: Directors, Performers, Duration (`filmTime`), Release Date (`onTime`).
    *   Display **Synopsis** (`introduction`).
    *   **Action Button**: Add a "立即购票" (Buy Ticket) button.
        *   *Note*: Since the Booking API is not ready, this button should just show a `toast` or `alert` saying "功能开发中" (Feature under development) or be disabled.
    *   **Styling**: Use Tailwind CSS. Make it look modern (e.g., glassmorphism, large background image blur).

### 2. Registration Page (`app/register/page.tsx`)
**Goal**: Allow new users to create an account.
*   **Route**: `/register`
*   **UI Requirements**:
    *   Form fields: Username, Password, Confirm Password, Phone.
    *   "Register" button.
    *   Link to Login page ("Already have an account? Login").
*   **Logic**:
    *   *Note*: The backend Registration API might be missing.
    *   Create the form UI and validation (e.g., password match).
    *   For the submit action, simulate a success:
        *   `console.log` the form data.
        *   Show a success message "注册成功，请登录".
        *   Redirect to `/login` after 1.5 seconds.

### 3. Enhance Header (`components/Header.tsx`)
**Goal**: Improve user navigation.
*   If user is logged in (check `localStorage` or Auth Context):
    *   Show "Welcome, [Username]" text.
    *   Add a "Logout" button that clears token and refreshes/redirects.
*   If not logged in:
    *   Show "Login" and "Register" links.

## Technical Context
*   Framework: Next.js 14 (App Router)
*   Styling: Tailwind CSS
*   Icons: `lucide-react` (if available) or text.
*   HTTP Client: Native `fetch` or `utils/api.ts` (if exists).

## Deliverables
*   `app/films/[id]/page.tsx`
*   `app/register/page.tsx`
*   Updated `components/Header.tsx`
