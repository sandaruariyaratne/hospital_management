// db.js - Database Connection Configuration

// Import the PostgreSQL client
const { Pool } = require('pg');

// Load environment variables from .env file
require('dotenv').config();

// Create a connection pool
// Pool manages multiple database connections efficiently
const pool = new Pool({
  user: process.env.DB_USER,         // Database username
  host: process.env.DB_HOST,         // Database server address
  database: process.env.DB_NAME,     // Database name
  password: process.env.DB_PASSWORD, // Database password
  port: process.env.DB_PORT,         // PostgreSQL port (default: 5432)
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Database connected successfully!');
    release(); // Release the client back to the pool
  }
});

// Export the pool so other files can use it
module.exports = pool;