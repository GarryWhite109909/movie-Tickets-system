I have gathered all the necessary backend API information and inspected the `admin-new` directory structure.

### API Documentation Plan
I will create `API_DOCUMENTATION.md` in the root directory. This document will list all endpoints found in the controllers:
*   **Auth**: `/api/login` (Admin), `/api/web/login` (Web)
*   **Film**: `/api/film/all`, `/api/film/:id`, `POST /api/film`, `PUT /api/film/:id`, `DELETE /api/film/:id`
*   **Cinema**: `/api/cinema/room/list`, `POST /api/cinema/room`, `PUT /api/cinema/room/:id`, `DELETE /api/cinema/room/:id`
*   **System**: `/api/system/role/list`, `POST /api/system/role`, `/api/system/resource/list`
*   **Stats**: `/api/stats/overview`, `/api/stats/topFilms`
*   **Upload**: `/api/upload`, `/api/web/uploadAvatar`

### Frontend Implementation Plan (via React Vite Engineer)
The `admin-new` project is a Vite + React + TypeScript application. I will instruct the `react-vite-engineer` agent to:
1.  **Setup**: Ensure `admin-new` has necessary dependencies (Ant Design, React Router, TanStack Query, Axios/Ky).
2.  **Auth Integration**: Update `Login.tsx` to use `/api/login` and store the token + permission data.
3.  **Layout**: Update `Layout.tsx` to render a sidebar menu based on user permissions (optional) or static for now, linking to new pages.
4.  **Film Management**: Create `pages/film/FilmList.tsx` (Table), `FilmEdit.tsx` (Modal/Form).
5.  **Cinema Management**: Create `pages/cinema/CinemaList.tsx` (Table), `CinemaEdit.tsx` (Modal/Form).
6.  **System Management**: Create `pages/system/RoleList.tsx` (Table), `RoleEdit.tsx` (Modal/Form).

I will now proceed to write the documentation and then trigger the agent.
