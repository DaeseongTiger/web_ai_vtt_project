const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();
const jsonParser = bodyParser.json();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'default_secret_key'; 

app.use(cors());
app.use(jsonParser);

// Variable to hold the connection
let connection;

// Connect to the database
async function connectToDatabase() {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'mydb',
        });
        console.log('Connected to MySQL database!');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process if unable to connect to the database
    }
}

// Call the async function to connect to the database
connectToDatabase();

// Middleware to check database connection
function checkDatabaseConnection(req, res, next) {
    if (!connection) {
        return res.status(500).json({ status: 'error', message: 'Database connection lost' });
    }
    next();
}

// User registration
app.post('/register', checkDatabaseConnection, async (req, res) => {
    try {
        if (!/\S+@\S+\.\S+/.test(req.body.email)) {
            return res.status(400).json({ status: 'error', message: 'Invalid email format' });
        }

        const [existingUser] = await connection.execute('SELECT * FROM users WHERE email = ?', [req.body.email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Email already exists' });
        }

        const hash = await bcrypt.hash(req.body.password, saltRounds);
        await connection.execute('INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)', 
                                  [req.body.email, hash, req.body.fname || '', req.body.lname || '']);

        res.json({ status: 'ok' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ status: 'error', message: err.message || 'Unknown error occurred' });
    }
});

// User login
app.post('/login', checkDatabaseConnection, async (req, res) => {
    try {
        if (!/\S+@\S+\.\S+/.test(req.body.email)) {
            return res.status(400).json({ status: 'error', message: 'Invalid email format' });
        }

        const [users] = await connection.execute('SELECT * FROM users WHERE email=?', [req.body.email]);
        if (users.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No user found' });
        }

        const isLogin = await bcrypt.compare(req.body.password, users[0].password);
        if (isLogin) {
            const token = jwt.sign({ email: users[0].email }, jwtSecret, { expiresIn: '1h' });
            res.json({ status: 'success', message: 'Login success', token: token });
        } else {
            res.status(401).json({ status: 'error', message: 'Login failed' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ status: 'error', message: err.message || 'Unknown error occurred' });
    }
});

// Token validation middleware
function authenticateToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Token not provided' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }
        req.user = decoded; // Save decoded token data in request
        next();
    });
}

// Token validation route
app.post('/authen', authenticateToken, (req, res) => {
    res.json({ status: 'success', message: 'Token is valid', data: req.user });
});

// Start the server
app.listen(3333, () => {
    console.log('CORS-enabled web server listening on port 3333');
});
