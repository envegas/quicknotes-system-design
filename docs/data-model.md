


# QuickNotes Database Design

## 1. Overview

QuickNotes uses a relational SQL database to store user accounts, notes, and tags.

The database contains four main tables:

1. `users`: Stores registered user information.
2. `notes`: Stores notes created by users.
3. `tags`: Stores categories or labels created by users.
4. `note_tags`: Connects notes to tags.

The proposed database uses PostgreSQL.

## 2. Database Entities and Columns

### 2.1 Users Table

Stores information about registered users.

| Column | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGINT | Primary Key | Unique user identifier |
| name | VARCHAR(100) | NOT NULL | User's full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email |
| password_hash | VARCHAR(255) | NOT NULL | Securely hashed password |
| created_at | TIMESTAMPTZ | NOT NULL | Account creation date |

### 2.2 Notes Table

Stores notes created by users.

| Column | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGINT | Primary Key | Unique note identifier |
| user_id | BIGINT | Foreign Key, NOT NULL | Owner of the note |
| title | VARCHAR(100) | NOT NULL | Note title |
| body | TEXT | NOT NULL | Note content |
| created_at | TIMESTAMPTZ | NOT NULL | Note creation date |
| updated_at | TIMESTAMPTZ | NOT NULL | Last update date |

### 2.3 Tags Table

Stores tags that users can assign to their notes.

| Column | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGINT | Primary Key | Unique tag identifier |
| user_id | BIGINT | Foreign Key, NOT NULL | Owner of the tag |
| name | VARCHAR(50) | NOT NULL | Tag name |
| created_at | TIMESTAMPTZ | NOT NULL | Tag creation date |

A user cannot create two tags with the same name.

### 2.4 Note_Tags Table

Connects notes to tags.

| Column | Data Type | Constraint | Description |
|---|---|---|---|
| note_id | BIGINT | Foreign Key, Primary Key | Related note |
| tag_id | BIGINT | Foreign Key, Primary Key | Related tag |

The combination of `note_id` and `tag_id` forms a composite primary key. This prevents the same tag from being assigned to the same note more than once.

## 3. Database Relationships

The database uses the following relationships:

### One-to-Many Relationships

**Users and Notes**

One user can create many notes, but each note belongs to one user.

`users.id` → `notes.user_id`

**Users and Tags**

One user can create many tags, but each tag belongs to one user.

`users.id` → `tags.user_id`

### Many-to-Many Relationship

**Notes and Tags**

One note can have multiple tags, and one tag can be assigned to multiple notes.

The `note_tags` table connects these two tables.

`notes.id` → `note_tags.note_id`

`tags.id` → `note_tags.tag_id`

## 4. SQL CREATE TABLE Statements

The following SQL statements create the four database tables.

```sql
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_note_title
        CHECK (LENGTH(TRIM(title)) > 0)
);

CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tags_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_tag
        UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
    note_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,

    PRIMARY KEY (note_id, tag_id),

    CONSTRAINT fk_note_tags_note
        FOREIGN KEY (note_id)
        REFERENCES notes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_note_tags_tag
        FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);
```

The application must also verify that a note and its assigned tag belong to the same user before creating a relationship in `note_tags`.

## 5. SQL Queries

### Query 1: Retrieve All Notes for a User

```sql
SELECT id, title, body, created_at, updated_at
FROM notes
WHERE user_id = 1
ORDER BY updated_at DESC;
```

**Purpose:** Retrieves notes belonging to a particular user, with recently updated notes appearing first.

### Query 2: Retrieve One Note

```sql
SELECT id, title, body, created_at, updated_at
FROM notes
WHERE id = 101
AND user_id = 1;
```

**Purpose:** Retrieves a specific note while ensuring that it belongs to the authenticated user.

### Query 3: Retrieve Notes with Their Tags (JOIN)

```sql
SELECT
    n.id AS note_id,
    n.title,
    n.body,
    t.name AS tag_name
FROM notes n
JOIN note_tags nt
    ON n.id = nt.note_id
JOIN tags t
    ON nt.tag_id = t.id
WHERE n.user_id = 1;
```

**Purpose:** Uses JOIN operations to retrieve notes together with their assigned tags.

### Query 4: Count Notes Created by Each User

```sql
SELECT
    u.id,
    u.name,
    COUNT(n.id) AS total_notes
FROM users u
LEFT JOIN notes n
    ON u.id = n.user_id
GROUP BY u.id, u.name;
```

**Purpose:** Counts the number of notes belonging to each user, including users who have not created any notes.

## 6. Database Indexing

An index improves database lookup performance by reducing the amount of data the database needs to scan.

Recommended index:

```sql
CREATE INDEX idx_notes_user_updated
ON notes(user_id, updated_at DESC);
```

**Reason:**

QuickNotes frequently retrieves notes belonging to a particular user and sorts them by their last update date.

This index helps the database locate a user's notes and retrieve them in the required order more efficiently.

A second useful index is:

```sql
CREATE INDEX idx_note_tags_tag
ON note_tags(tag_id);
```

This helps retrieve notes associated with a particular tag.

## 7. SQL vs NoSQL

### SQL Databases

Examples: PostgreSQL, MySQL and Microsoft SQL Server.

Advantages:

- Structured tables and relationships.
- Strong data integrity through primary and foreign keys.
- Supports complex queries and JOIN operations.
- Supports transactions.
- Suitable for applications with related data.

### NoSQL Databases

Examples: MongoDB, Cassandra and Amazon DynamoDB.

Advantages:

- Flexible data structures.
- Suitable for document-based data.
- Can support large-scale distributed workloads.
- Can be useful when application data has rapidly changing structures.

### Why QuickNotes Uses SQL

QuickNotes uses PostgreSQL because its data has clear relationships.

Users own notes, users create tags, and notes can have multiple tags.

A relational database makes it easier to enforce these relationships, prevent invalid references, and maintain data consistency.

SQL also supports transactions, which are useful when multiple related database operations must succeed together.

Although NoSQL could support a future version of QuickNotes, PostgreSQL is a suitable choice for the current application.

## 8. Data Integrity and Security

The database design includes several measures to protect data:

- Primary keys uniquely identify database records.
- Foreign keys prevent invalid relationships.
- Unique email addresses prevent duplicate user accounts.
- Unique user-tag combinations prevent duplicate tags for the same user.
- Cascading deletes remove dependent records when a user, note, or tag is deleted.
- Passwords are stored as secure hashes, never as plain text.
- The backend verifies note ownership before allowing access or modification.

## 9. Conclusion

The QuickNotes database uses four related tables to organize users, notes, and tags.

The design supports one-to-many and many-to-many relationships, provides SQL queries for common application operations, and uses indexes to improve retrieval performance.

PostgreSQL provides the relational structure and data integrity required for the current QuickNotes application.

