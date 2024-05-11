const mysql = require('mysql2');
const config = require('../config/config');

const express = require('express');
const app = express();

// Create a database connection pool
const pool = mysql.createPool(config.database);

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database successfully!');
  connection.release(); // Release the connection
});

// server.js (or app.js)

// Define a route for creating a new entity
app.post('/api/entities', (req, res) => {
    const { name, email, mobileNumber, dateOfBirth } = req.body; // Assuming request body contains entity data
    const sql = 'INSERT INTO entities (name, email, mobileNumber, dateOfBirth) VALUES (?, ?, ?, ?)';
    pool.query(sql, [name, email, mobileNumber, dateOfBirth], (err, result) => {
      if (err) {
        console.error('Error creating entity:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      console.log('Entity created successfully!');
      res.status(201).send('Entity created successfully!');
    });
  });
  
  // Define routes for other CRUD operations (Read, Update, Delete)
  // ...
  

  
  // server.js (or app.js)


// Add middleware, route handlers, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
