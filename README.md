# 📚 Reading Recommendation System API

The Reading Recommendation System API allows users to submit their reading intervals and recommends the top-rated books based on unique pages read by all users. The API supports role-based authorization, logging, and testing for a secure and reliable implementation.

---

## 🚀 Features

- **Submit Reading Intervals**: Users can log their reading activity by providing start and end pages for specific books.
- **Top 5 Recommendations**: Retrieves the top 5 books based on the number of unique pages read across all users.
- **Role-Based Authorization**: Admins can manage books, while regular users can log their intervals.
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
