# Node.js REST API for Business Content Management

## Project Overview

This project implements a REST API server using Node.js to serve a web application for business content management. The API allows business users to publish, edit, and delete content.

## Key Features

- User registration, login, and management.
- Business card creation and management.
- Content publication with access control for business users.

## Technologies

- **MongoDB**: For storing data.
- **Express.js**: Web server framework.
- **Mongoose**: MongoDB object modeling.
- **Bcryptjs**: Password hashing.
- **Joi**: Data validation.
- **JsonWebToken**: Secure authentication.
- **Config**: Configuration management.
- **Morgan**: Request logging.
- **Cors**: Cross-Origin Resource Sharing.
- **Chalk**: Console output styling.

## Bonus

- **Biz Number**: Can edit Biz Number
- **File Logger**: Catch all 400+ errors to folder logs
- **Block User**: After 3 attempts user blocked for 24 hours

## API Endpoints

### User Endpoints

| No. | Method | URL          | Action            | Authorization            | Return         |
| --- | ------ | ------------ | ----------------- | ------------------------ | -------------- |
| 1   | POST   | /users       | Register user     | All                      | User object    |
| 2   | POST   | /users/login | Login             | All                      | JWT            |
| 3   | GET    | /users       | Get all users     | Admin                    | Users array    |
| 4   | GET    | /users/:id   | Get user          | Registered user or Admin | User object    |
| 5   | PUT    | /users/:id   | Edit user         | Registered user          | Updated user   |
| 6   | PATCH  | /users/:id   | Change isBusiness | Registered user          | Updated status |
| 7   | DELETE | /users/:id   | Delete user       | Registered user or Admin | Deleted user   |

### Card Endpoints

| No. | Method | URL                   | Action          | Authorization         | Return       |
| --- | ------ | --------------------- | --------------- | --------------------- | ------------ |
| 1   | GET    | /cards                | Get all cards   | All                   | Cards array  |
| 2   | GET    | /cards/my-cards       | Get user cards  | Registered user       | User's cards |
| 3   | GET    | /cards/:id            | Get card        | All                   | Card object  |
| 4   | POST   | /cards                | Create new card | Business user         | Created card |
| 5   | PUT    | /cards/:id            | Edit card       | Card creator          | Updated card |
| 6   | PATCH  | /cards/:id            | Like card       | Registered user       | Updated card |
| 7   | DELETE | /cards/:id            | Delete card     | Card creator or Admin | Deleted card |
| 8   | PATCH  | /cards/biz-number/:id | Delete user     | Admin                 | Deleted user |

## Getting Started

To get started with this project, clone the repository and install dependencies:

```bash
git clone https://github.com/MaxKovalski/node-project-hackeru.git
Change into the project directory
Install the necessary dependencies
```

Ensure you have a MongoDB instance running and configure your `.env` file with the appropriate environment variables.

## Usage

Start the server:

```bash
npm start
```
