I have identified a potential critical issue in the backend services related to `BigInt` serialization. The `Film` and `Arrange` tables use `BigInt` for IDs (`filmId`, `arrangeId`), but the raw SQL queries return these as `BigInt` objects which `JSON.stringify` cannot serialize, causing the API to fail (likely returning 500 errors or invalid responses that the frontend cannot parse, leading to "Invalid source map" errors).

I will proceed with the following steps:

1. **Fix Backend Errors (NestJS Architect)**:

   * Call the `nestjs-architect` agent to implement a global solution for BigInt serialization (e.g., a Global Interceptor or modifying `main.ts` to handle BigInt to JSON conversion).

   * Alternatively, manually fix `FilmService` and `ArrangeService` to ensure all `BigInt` fields (especially `filmId` in `ArrangeService`) are converted to strings before returning.

   * Review and fix any other potential logic errors in `FilmService`, `ArrangeService`, and `BookingService`.

2. **Verify API (API Integration Tester)**:

   * Use the `api-integration-tester` agent to call the fixed endpoints (`/film/all`, `/film/:id`, `/arrange/film/:id`, `/arrange/:id`) and verify they return valid JSON with correct data structures.

3. **Verify Frontend**:

   * Once the backend is confirmed working, I will ask you to verify the frontend in the browser preview.

   * If issues persist, I will investigate the frontend code further.

