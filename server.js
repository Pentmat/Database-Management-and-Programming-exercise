import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pkg;

const app = express();
const PORT = 3001;


const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: '',
    port: 5432, // default PostgreSQL port
});

app.listen(
    PORT,
    () => { console.log(`its alive on http://localhost:${PORT}`); }
);

app.get('/', (req, res) => {
    res.send('Rise my beatifull server!!!');
});

app.use(express.json());


// FUNCTION HASH PASSWORDS

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}



// POST GENRE

app.post('/genres', async (req, res) => {
    const { genre_name } = req.body;

    if (!genre_name) {
        return res.status(400).send('Genre name is required');
    }

    try {
        const result = await pool.query('INSERT INTO Genre (genre_name) VALUES ($1) RETURNING *', [genre_name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

// POST MOVIE

app.post('/movies', async (req, res) => {
    try {
        const { movie_name, year, genre_id } = req.body;

        
        if (!movie_name || !year || !genre_id) {
            return res.status(400).json({ error: 'movie_name, year, and genre_id are required' });
        }

        
        const result = await pool.query(
            'INSERT INTO Movie (movie_name, year, genre_id) VALUES ($1, $2, $3) RETURNING *',
            [movie_name, year, genre_id]
        );

        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding new movie:', error.message);
        res.status(500).json({ error: 'Failed to add movie' });
    }
});

// POST NEW USER

app.post('/users', async (req, res) => {
    try {
        const { name, username, password, register_time } = req.body;

        // Validate input
        if (!name || !username || !password || !register_time) {
            return res.status(400).json({ error: 'name, username, password, and register_time are required' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Parse register_time as Date
        const formattedRegisterTime = new Date(register_time);
        if (isNaN(formattedRegisterTime)) {
            return res.status(400).json({ error: 'Invalid date format for register_time' });
        }

        // Insert new user into the User_register table
        const result = await pool.query(
            'INSERT INTO User_register (name, username, password, register_time) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, username, hashedPassword, formattedRegisterTime]
        );

        // Respond with the new user details (excluding password for security)
        const user = result.rows[0];
        delete user.password; // Remove password from response for security
        res.status(201).json(user);

    } catch (error) {
        console.error('Error adding new user:', error.message);
        if (error.code === '23505') { // Unique violation for username
            return res.status(409).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: 'Failed to add user' });
    }
});


// GET MOVIE ID 

app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Movie WHERE movie_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error retrieving movie by ID:', error.message);
        res.status(500).json({ error: 'Failed to retrieve movie' });
    }
});

// DELETE MOVIE BY ID

app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Movie WHERE movie_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted successfully', movie: result.rows[0] });
    } catch (error) {
        console.error('Error deleting movie by ID:', error.message);
        res.status(500).json({ error: 'Failed to delete movie' });
    }
});

// GET MOVIES

app.get('/movies', async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;
    try {
        const result = await pool.query('SELECT * FROM Movie LIMIT $1 OFFSET $2', [limit, offset]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving movies:', error.message);
        res.status(500).json({ error: 'Failed to retrieve movies' });
    }
});

// GET MOVIES KEYWORD

app.get('/movies/search', async (req, res) => {
    const { keyword } = req.query;
    try {
        const result = await pool.query('SELECT * FROM Movie WHERE movie_name ILIKE $1', [`%${keyword}%`]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error searching for movies:', error.message);
        res.status(500).json({ error: 'Failed to search movies' });
    }
});

// POST REVIEWS

app.post('/reviews', async (req, res) => {
    const { username, stars, review_text, movie_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Review (username, stars, review_text, movie_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, stars, review_text, movie_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// POST FAVORITE USER MOVIES

app.post('/favorites', async (req, res) => {
    const { username, movie_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Favorite_movie (username, movie_id) VALUES ($1, $2) RETURNING *',
            [username, movie_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding to favorites:', error.message);
        res.status(500).json({ error: 'Failed to add favorite movie' });
    }
});

// GET USERS FAVORITE MOVIES

app.get('/favorites/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query(
            'SELECT Movie.* FROM Movie JOIN Favorite_movie ON Movie.movie_id = Favorite_movie.movie_id WHERE Favorite_movie.username = $1',
            [username]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving favorite movies:', error.message);
        res.status(500).json({ error: 'Failed to retrieve favorite movies' });
    }
});