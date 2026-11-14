

# QuickNotes REST API Design

## 1. Overview

The QuickNotes API allows registered users to create, view, update, organize, and delete personal notes.

The API follows REST principles and uses JSON for request and response data.

**Base URL:**

`https://api.quicknotes.com/api/v1`

**Data format:** JSON

**Authentication:** Bearer token authentication

## 2. Authentication

Users must authenticate before accessing their personal notes.

After a successful login, the API returns an access token.

Clients include this token in the Authorization header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The backend checks the token to identify the user and determine which notes they are allowed to access.

## 3. API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | 201 Created |
| POST | `/auth/login` | Authenticate a user | 200 OK |
| POST | `/auth/logout` | Log out the current user | 204 No Content |
| GET | `/notes` | Retrieve the user's notes | 200 OK |
| GET | `/notes/{noteId}` | Retrieve one specific note | 200 OK |
| POST | `/notes` | Create a new note | 201 Created |
| PATCH | `/notes/{noteId}` | Update an existing note | 200 OK |
| DELETE | `/notes/{noteId}` | Delete a note | 204 No Content |
| GET | `/tags` | Retrieve available tags | 200 OK |

## 4. Endpoint Details

### 4.1 Register a User

**Method:** POST

**Path:** `/auth/register`

**Description:** Creates a new user account.

**Request body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success response:** `201 Created`

```json
{
  "message": "Account created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 4.2 Login

**Method:** POST

**Path:** `/auth/login`

**Description:** Verifies the user's credentials and returns an access token.

**Request body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success response:** `200 OK`

```json
{
  "accessToken": "example-access-token",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

### 4.3 Get All Notes

**Method:** GET

**Path:** `/notes`

**Description:** Retrieves notes belonging to the authenticated user.

**Optional query parameters:**

- `page`: Page number.
- `limit`: Number of notes per page.
- `search`: Search notes by title or content.

**Example request:**

```http
GET /api/v1/notes?page=1&limit=10
```

**Success response:** `200 OK`

```json
{
  "data": [
    {
      "id": 101,
      "title": "Meeting Notes",
      "body": "Discuss the project timeline.",
      "createdAt": "2026-11-14T10:00:00Z",
      "updatedAt": "2026-11-14T10:00:00Z"
    },
    {
      "id": 102,
      "title": "Shopping List",
      "body": "Milk, bread and eggs.",
      "createdAt": "2026-11-14T11:00:00Z",
      "updatedAt": "2026-11-14T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2
  }
}
```

### 4.4 Get One Note

**Method:** GET

**Path:** `/notes/{noteId}`

**Description:** Retrieves a specific note belonging to the authenticated user.

**Example request:**

```http
GET /api/v1/notes/101
```

**Success response:** `200 OK`

```json
{
  "id": 101,
  "title": "Meeting Notes",
  "body": "Discuss the project timeline.",
  "createdAt": "2026-11-14T10:00:00Z",
  "updatedAt": "2026-11-14T10:00:00Z"
}
```

### 4.5 Create a Note

**Method:** POST

**Path:** `/notes`

**Description:** Creates a new note for the authenticated user.

**Request body:**

```json
{
  "title": "Project Planning",
  "body": "Prepare the project requirements and timeline."
}
```

**Success response:** `201 Created`

```json
{
  "id": 103,
  "title": "Project Planning",
  "body": "Prepare the project requirements and timeline.",
  "createdAt": "2026-11-14T12:00:00Z",
  "updatedAt": "2026-11-14T12:00:00Z"
}
```

The backend automatically associates the new note with the authenticated user.

### 4.6 Update a Note

**Method:** PATCH

**Path:** `/notes/{noteId}`

**Description:** Updates one or more fields of an existing note.

**Request body:**

```json
{
  "title": "Updated Project Planning"
}
```

**Success response:** `200 OK`

```json
{
  "id": 103,
  "title": "Updated Project Planning",
  "body": "Prepare the project requirements and timeline.",
  "updatedAt": "2026-11-14T13:00:00Z"
}
```

### 4.7 Delete a Note

**Method:** DELETE

**Path:** `/notes/{noteId}`

**Description:** Permanently deletes a note belonging to the authenticated user.

**Example request:**

```http
DELETE /api/v1/notes/103
```

**Success response:** `204 No Content`

The server returns no response body when deletion succeeds.

### 4.8 Get All Tags

**Method:** GET

**Path:** `/tags`

**Description:** Retrieves the tags available to the authenticated user for organizing notes.

**Success response:** `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "name": "Work"
    },
    {
      "id": 2,
      "name": "Personal"
    }
  ]
}
```

## 5. HTTP Error Codes

The API uses standard HTTP status codes to communicate errors.

| Status Code | Meaning | Example |
|---|---|---|
| 400 | Bad Request | Required title is missing |
| 401 | Unauthorized | Missing or invalid access token |
| 403 | Forbidden | User is not permitted to perform an action |
| 404 | Not Found | Requested note does not exist |
| 500 | Internal Server Error | Unexpected server failure |

The API should not expose private information about another user's notes. Depending on the endpoint and security policy, an inaccessible note may be returned as 404 rather than revealing that it exists.

## 6. Standard Error Response

Errors use a consistent JSON structure.

**Example:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The title field is required.",
    "status": 400
  }
}
```

This structure makes it easier for frontend applications to display useful error messages.

## 7. API Validation and Security

The backend should enforce the following rules:

- User email addresses must be unique.
- Passwords must be securely hashed before storage.
- Note titles are required and must not exceed 100 characters.
- Note content must be validated before saving.
- Users can only view, update, or delete their own notes.
- Authentication tokens must be validated on protected endpoints.
- All communication must use HTTPS.
- Database queries must use parameterized statements to reduce SQL injection risks.
- Request data must be validated on the server, even when frontend validation exists.

## 8. Design Decisions

**REST architecture:** HTTP methods represent the actions performed on resources.

**JSON format:** JSON is lightweight and easy for frontend applications to process.

**Bearer token authentication:** Tokens allow the API to identify authenticated users without relying on a server-side session for every request.

**Pagination:** Pagination prevents the API from returning an unnecessarily large number of notes at once.

**Consistent errors:** A standard error structure makes frontend error handling easier.

**Resource ownership:** Every note is associated with a user, and the backend enforces ownership checks to protect user data.

## 9. Conclusion

The QuickNotes API provides a structured and secure way for frontend applications to manage notes.

It supports user authentication, note creation, retrieval, updating, deletion, and tag retrieval. The design also considers validation, security, pagination, and consistent error handling to support future growth.






