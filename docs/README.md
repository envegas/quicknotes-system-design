
# QuickNotes System Design

## 1. Project Overview

QuickNotes is a simple note-taking application and system design project.

The application allows users to retrieve notes, create new notes, and delete existing notes through a web interface.

This project demonstrates practical frontend development, REST API integration, database design, and system architecture.

The system design considers how QuickNotes could scale to support 1 million registered users.

## 2. Features

- Retrieve notes from a REST API.
- Create new notes.
- Delete notes.
- Validate note titles and content.
- Display loading, success, error, and empty states.
- Disable buttons while requests are processing.
- Display notes dynamically using JavaScript.
- Document a scalable backend API.
- Design a relational database using PostgreSQL.
- Propose a scalable cloud architecture.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Application styling |
| JavaScript | Frontend functionality and API requests |
| Fetch API | Communicating with the REST API |
| JSONPlaceholder | Mock REST API for testing |
| PostgreSQL | Proposed application database |
| Git and GitHub | Version control and project hosting |
| Markdown | Technical documentation |

## 4. Project Structure

```text
quicknotes-system-design/
│
├── index.html
├── style.css
├── api.js
├── README.md
│
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## 5. How to Run the Application

### Requirements

- A modern web browser.
- Internet connection.
- Visual Studio Code (recommended).
- Live Server extension for Visual Studio Code (recommended).

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/envegas/quicknotes-system-design.git
   ```

2. Open the project folder:

   ```bash
   cd quicknotes-system-design
   ```

3. Open the folder in Visual Studio Code:

   ```bash
   code .
   ```

4. Open `index.html` using the Live Server extension.

5. Click the **Load Notes** button to retrieve notes.

6. Enter a title and note content, then submit the form to create a note.

7. Use the Delete button to remove a note from the displayed list.

### API Information

The frontend uses JSONPlaceholder:

`https://jsonplaceholder.typicode.com/posts`

JSONPlaceholder is a public mock REST API used for testing and learning.

It does not provide permanent storage for these operations. POST and DELETE requests simulate API behaviour, so changes are not permanently saved on the remote service.

The production API described in the documentation is a proposed design, not an implemented backend.

## 6. Technical Documentation

The following documents explain the proposed production system.

| Document | Description |
|---|---|
| [API Design](docs/api-design.md) | REST endpoints, authentication, request and response examples, and HTTP errors |
| [Data Model](docs/data-model.md) | Database entities, relationships, SQL queries, indexes, and database choice |
| [System Architecture](docs/architecture.md) | Architecture diagram, capacity estimates, request flows, scalability, and availability |

## 7. Scalability Overview

The proposed QuickNotes architecture is designed around 1 million registered users.

It includes:

- DNS and CDN for domain resolution and static content delivery.
- Load balancing across multiple application servers.
- Redis caching to reduce repeated database queries.
- PostgreSQL as the primary relational database.
- Read replicas to support read-heavy workloads.
- Message queues and background workers for asynchronous processing.
- Monitoring, logging, backups, and redundancy.

The architecture documentation includes the assumptions and calculations behind the capacity estimates.

## 8. What I Learned

Through this project, I learned:

1. **REST API integration:** How to use JavaScript Fetch API to retrieve, create, and delete resources, including handling errors and HTTP responses.

2. **API design:** How to structure REST endpoints, define request and response formats, and use HTTP status codes.

3. **Database design:** How to create relational database tables, define primary and foreign keys, and model one-to-many and many-to-many relationships.

4. **SQL queries:** How to retrieve related information using JOIN operations and improve query performance with indexes.

5. **System architecture:** How components such as load balancers, caches, read replicas, and message queues support scalability and availability.

6. **Capacity planning:** How to estimate application traffic and storage requirements using user activity assumptions.

7. **Version control:** How to organize project work into meaningful Git commits and maintain a GitHub repository.

## 9. Future Improvements

Potential improvements include:

- Build a real backend API.
- Implement user registration and authentication.
- Connect the application to a PostgreSQL database.
- Add note editing and search functionality.
- Implement persistent note and tag management.
- Add automated testing.
- Deploy the application to a cloud hosting platform.

## 10. Repository

GitHub: https://github.com/envegas/quicknotes-system-design


