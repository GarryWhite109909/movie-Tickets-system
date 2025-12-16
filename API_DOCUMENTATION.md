# API Documentation

## Base URL
`http://localhost:3003` (Global prefix: `api` might be configured in main.ts, assuming direct mapping for now based on controller decorators, but typical NestJS apps use `/api`. Please verify `server-nest/src/main.ts` if needed. *Correction based on previous turn: The user mentioned `localhost:3003` 404 on root, and I confirmed global prefix. Let's assume `/api` prefix.*)

## 1. Authentication (`/api/auth`)

### Admin Login
*   **URL**: `/api/login`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "userName": "admin",
      "password": "password"
    }
    ```
*   **Response**:
    ```json
    {
      "code": 1,
      "msg": "ok",
      "data": { "token": "...", "role": "admin", ... }
    }
    ```

### Web Login (User)
*   **URL**: `/api/web/login`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "userName": "user",
      "password": "password"
    }
    ```
*   **Response**:
    ```json
    {
      "code": 1,
      "msg": "登录成功",
      "data": { "token": "...", "role": "user", "permissions": ["film:view"], ... }
    }
    ```

## 2. Film Management (`/api/film`)

### Get All Films
*   **URL**: `/api/film/all`
*   **Method**: `GET`
*   **Response**: `{ "code": 1, "data": [ ...films ] }`

### Get Single Film
*   **URL**: `/api/film/:id`
*   **Method**: `GET`

### Create Film
*   **URL**: `/api/film`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "filmName": "Name",
      "englishName": "Eng Name",
      "introduction": "Intro",
      "directors": "Director",
      "performers": "Actors",
      "filmTime": "120 mins",
      "onTime": "2023-01-01",
      "poster": "/uploads/..." (optional)
    }
    ```

### Update Film
*   **URL**: `/api/film/:id`
*   **Method**: `PUT`
*   **Body**: Same as Create

### Delete Film
*   **URL**: `/api/film/:id`
*   **Method**: `DELETE`

## 3. Cinema/Room Management (`/api/cinema`)

### Get Room List
*   **URL**: `/api/cinema/room/list`
*   **Method**: `GET`
*   **Response**: `{ "code": 1, "data": [ ...rooms ] }`

### Create Room
*   **URL**: `/api/cinema/room`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "roomName": "Hall 1",
      "number": "1",
      "row": 10,
      "column": 15
    }
    ```

### Update Room
*   **URL**: `/api/cinema/room/:id`
*   **Method**: `PUT`
*   **Body**: Same as Create

### Delete Room
*   **URL**: `/api/cinema/room/:id`
*   **Method**: `DELETE`

## 4. System Management (`/api/system`)

### Get Role List
*   **URL**: `/api/system/role/list`
*   **Method**: `GET`
*   **Response**: `{ "code": 1, "data": [ { "code": "admin", "permissions": [...] } ] }`

### Create Role
*   **URL**: `/api/system/role`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "code": "finance",
      "name": "Finance Staff",
      "description": "...",
      "permissionIds": [1, 2, 3]
    }
    ```

### Get Resource/Permission List
*   **URL**: `/api/system/resource/list`
*   **Method**: `GET`
*   **Response**: `{ "code": 1, "data": [ ...resources_with_permissions ] }`

## 5. Statistics (`/api/stats`)

### Overview
*   **URL**: `/api/stats/overview`
*   **Method**: `GET`

### Top Films
*   **URL**: `/api/stats/topFilms`
*   **Method**: `GET`
*   **Query**: `limit=10`

## 6. Upload (`/api`)

### Upload Image
*   **URL**: `/api/upload`
*   **Method**: `POST`
*   **Body**: Form Data with `avatar` file field.
*   **Response**: `{ "code": 0, "filePath": "/uploads/..." }`
