# 📖 Forum API V1

A simple and scalable Forum API built using Node.js with a Clean Architecture approach, featuring authentication, thread management, comments, and replies.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (register, login, logout)
- Thread management (create, retrieve)
- Comment management (add, delete)
- Reply management (add replies to comments, delete replies from comments)
- Soft deletion for comments and replies
- Database migrations with `node-pg-migrate`

## Technologies

- **Node.js** - Server-side runtime
- **Hapi** - Web framework
- **PostgreSQL** - Database
- **Jest** - Testing framework
- **instances-container** - Dependency injection container
- **bcrypt** - Password hashing
- **JWT** - Token-based authentication

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AxelSeanCP/Forum-API.git
   cd Forum-API
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add your configurations:

   ```plaintext
    # HTTP SERVER
    HOST=localhost
    PORT=5000

    # POSTGRES
    PGHOST=localhost
    PGUSER=your-user
    PGDATABASE=forumapi
    PGPASSWORD=your-password
    PGPORT=5432

    # POSTGRES TEST
    PGHOST_TEST=localhost
    PGUSER_TEST=your-user
    PGDATABASE_TEST=forumapi_test
    PGPASSWORD_TEST=your-password
    PGPORT_TEST=5432

    # TOKENIZE
    ACCESS_TOKEN_KEY=your-key
    REFRESH_TOKEN_KEY=your-key
    ACCCESS_TOKEN_AGE=your-token-age

   ```

4. **Initialize the database:**

   Make sure PostgreSQL is running, and create the initial tables:

   ```bash
   npm run migrate up
   ```

### Running the Server

Start the server locally:

```bash
npm run start
```

Your server should be running on `http://localhost:5000`.

## Project Structure

- `src/` - Main source directory
  - `Applications/` - Use cases and business logic
  - `Domains/` - Core entities and domain logic
  - `Infrastructures/` - PostgreSQL repositories and external service implementations
  - `Interfaces/` - HTTP routes and request handling
- `tests/` - Testing utilities and test cases
- `migrations/` - Database migration files

## Scripts

- `npm run start` - Run the server
- `npm run start:prod` - Run the server in production mode
- `npm run start:dev` - Run the server in development mode (with Nodemon)
- `npm run test` - Run tests with Jest
- `npm run test:watch` - Run all tests with Jest
- `npm run migrate up` - Run all migrations up
- `npm run migrate down 0` - Roll back all migrations
- `npm run lint` - Lint all the codes

## API Endpoints

### Authentication

- **POST** `/users` - Register a new user
- **POST** `/authentications` - Log in as an existing user
- **DELETE** `/authentications` - Log out from the current session

### Threads

- **POST** `/threads` - Create a new thread
- **GET** `/threads/:id` - Retrieve a thread with its comments and replies

### Comments

- **POST** `/threads/:threadId/comments` - Add a comment to a thread
- **DELETE** `/threads/:threadId/comments/:commentId` - Soft delete a comment
- **PUT** `/threads/:threadId/comments/:commentId/likes` - Like or unlike a comment

### Replies

- **POST** `/threads/:threadId/comments/:commentId/replies` - Add a reply to a comment
- **DELETE** `/threads/:threadId/comments/:commentId/replies/:replyId` - Soft delete a reply

## Testing

Run tests using Jest:

```bash
npm run test:watch
```

Ensure the database is set up correctly for testing, and add any environment variables in a `.env.test` file if needed.

## Contributing

1. Fork the repository.
2. Create a new branch with your feature or bug fix.
3. Commit your changes.
4. Push to your branch and open a pull request.
