# 📚 Reading Recommendation System API

The Reading Recommendation System API allows users to submit their reading intervals and recommends the top-rated books based on unique pages read by all users. The API supports role-based authorization, logging, and testing for a secure and reliable implementation.

---

## 🚀 Features

- **Submit Reading Intervals**: Users can log their reading activity by providing start and end pages for specific books.
- **Top 5 Recommendations**: Retrieves the top 5 books based on the number of unique pages read across all users.
- **Role-Based Authorization**: Admins can manage books, while regular users can log their intervals.
- **RateLimitings**: Protect endpoints with throttling to prevent abuse
- **Logging & Exception Handling**: Logs errors and events for debugging and reliability.
- **Unit Testing**: Includes tests for services to ensure functionality.

---

## 🛠️ Technologies Used

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Authentication**: JWT (JSON Web Token)
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Documentation**: Swagger

---

## 🏗️ Project Structure

```plaintext
src/
|── common/            # Common utilities
|── config/            # Configuration files
|── modules/
|   |── auth/          # Authentication module
|   |── books/         # Books module
|   |── intervals/     # Intervals module
|   |── users/         # Users module
|── app.module.ts      # Main module
|── main.ts            # Entry point
```

---

## Environment Setup

Create an `.env` file in the project root with the following variables:

```
# Application configuration
NODE_ENV=local
PORT=3010

# Authentication Configuration
JWT_SECRET=YOUR_SECRET_KEY_HERE
JWT_TOKEN_AUDIENCE=localhost:3000
JWT_TOKEN_ISSUER=localhost:3000
JWT_ACCESS_TOKEN_TTL=60m
SALT=reading-recommendation-system-api

# Rate Limit Configuration
RATE_LIMIT_TIME_TO_LIVE=60000
RATE_LIMIT_NO_OF_REQUESTS=100

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_DATABASE=reading_recommendation_system_api_db
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
SSL=false
```

### Start with Docker Compose

Build and start the services using Docker Compose:

```Run Docker
docker-compose up --build
```

## 📖 API Endpoints

You can using when you run project with

```Run Application
npm run start:dev
```

you can open url <http://localhost:3010/api-docs>

## Testing

To run tests (if available):

```Run test
npm run test
```

## Deployment

For deployment, ensure the `.env` file is correctly configured for the production environment. Use a production-grade PostgreSQL database and secure secrets.
