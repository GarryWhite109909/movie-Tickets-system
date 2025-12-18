# Backend Requirement Document

## 1. Database Schema & Relationships

### Core Business Entities
- **User**: `user` (Basic info)
- **Film**: `film` (Movie details)
- **Cinema/Room**: `filmroom`, `seatinfo`
- **Scheduling**: `arrange` (Links Film + Room + Time + Price)
- **Order/Booking**: `booking` (Links User + Arrange + Seat)

### Booking Linkage
`user` (userId) → `booking` (arrangeId, row, col, price) → `arrange` (filmId, roomId) → `film` (filmId) / `filmroom` (roomId)

### Authentication & Permissions (RBAC)
- **Role**: `sys_role`
- **Permission**: `sys_permission`
- **Relation**: `sys_role_permission`
- **User-Role**: `sys_user_role` (To be standardized from `usertorole`)

## 2. Business Scenarios & Performance

### 2.1 Film List
- **Scenario**: Display list of active films sorted by newest.
- **SQL Pattern**: 
  ```sql
  SELECT * FROM film WHERE deletedAt IS NULL ORDER BY createdAt DESC
  ```
- **Performance Requirement**: P95 < 500ms
- **Index**: `idx_film_deleted_created` (Status: **Exists**)

### 2.2 Arrange List (Scheduling)
- **Scenario**: List showtimes for a specific film.
- **SQL Pattern**:
  ```sql
  SELECT * FROM arrange WHERE filmId = ? AND deletedAt IS NULL ORDER BY date, start
  ```
- **Performance Requirement**: P95 < 500ms
- **Index**: `idx_arrange_film_deleted_date_start` (Status: **Exists**)

### 2.3 Seat Selection & Validation
- **Scenario**: Check if seats are occupied before booking.
- **SQL Pattern**:
  ```sql
  SELECT row, col FROM booking WHERE arrangeId = ? AND row = ? AND col = ? AND deletedAt IS NULL
  ```
- **Performance Requirement**: P95 < 200ms
- **Index**: `idx_booking_arrange_deleted_row_col` (Status: **Exists**)

## 3. Transactions & Concurrency

### 3.1 Booking Transaction
- **Requirement**: Single order with multiple seats must be atomic.
- **Implementation**:
  - Wrap seat checks and insertions in a single Database Transaction (`START TRANSACTION` ... `COMMIT`).
  - **Status**: Currently missing in `BookingService`. Needs implementation.

### 3.2 Concurrency Control
- **Strategy**: Pessimistic Locking or Serializable Isolation.
- **Implementation**: 
  - Lock the `arrange` record (`SELECT ... FOR UPDATE`) to prevent concurrent bookings for the same show affecting seat availability checks.
  - Alternatively, use `SERIALIZABLE` isolation level for the transaction.
- **Constraint**: Unique constraint on `(arrangeId, row, col, deletedAt)` is difficult due to `deletedAt` timestamp. Application-level locking or Transaction locking is preferred.

## 4. Data Synchronization & ETL
- **Current Status**: No offline synchronization or ETL pipeline.
- **Future Scope**:
  - Daily aggregation of sales stats from `booking` to `stats` table.
  - Frequency: T+1 (Daily at 2:00 AM).

## 5. Security & Permissions
- **Matrix**:
  - **Admin**: All permissions.
  - **User**: `film:list`, `booking:create`.
- **Implementation**:
  - `AuthService` issues JWT with role/permissions.
  - `Guards` check `sys_permission.code`.
- **Code Entry**: 
  - `apps/server_nest/src/system/system.service.ts`
  - `apps/server_nest/src/auth/auth.service.ts`
