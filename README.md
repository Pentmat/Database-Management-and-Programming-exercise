
# Database Management and Programming Exercise

## Overview
This project is a school exercise focused on creating a REST API with a PostgreSQL database to manage movies and genres.

## Features
- Add, retrieve, and delete movies
- Add genres
- User registration with hashed passwords
- Manage movie reviews and user favorites

## Technologies Used
- Node.js
- Express
- PostgreSQL
- pg (PostgreSQL client for Node.js)
- bcrypt (for password hashing)

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/Database-Management-and-Programming-exercise.git
   cd Database-Management-and-Programming-exercise
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables**:
   ```bash
   export DB_USER=your_db_user
   export DB_HOST=127.0.0.1
   export DB_NAME=your_db_name
   export DB_PASSWORD=your_db_password
   export DB_PORT=5432
   ```

4. **Run the Server**:
   ```bash
   npm start
   ```

## API Endpoints

### Genres
- **POST /genres**: Add a new genre.

### Movies
- **POST /movies**: Add a new movie.
- **GET /movies/:id**: Get a movie by ID.
- **DELETE /movies/:id**: Delete a movie by ID.
- **GET /movies**: Get all movies with pagination.
- **GET /movies/search**: Search for movies by keyword.

### Users
- **POST /users**: Register a new user.

### Reviews
- **POST /reviews**: Add a review for a movie.

### Favorites
- **POST /favorites**: Add a movie to user favorites.
- **GET /favorites/:username**: Get a user's favorite movies.

## License
This project is licensed under the MIT License.

