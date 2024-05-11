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

// Define route for fetching all entities
app.get('/api/entities', (req, res) => {
  // Fetch all entities from the database
  const sql = 'SELECT * FROM entities';
  pool.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching entities:', err);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(results); // Send the retrieved entities as JSON response
  });
});

// Define route for fetching a single entity by ID
app.get('/api/entities/:id', (req, res) => {
  const entityId = req.params.id;
  // Fetch the entity from the database by ID
  const sql = 'SELECT * FROM entities WHERE id = ?';
  pool.query(sql, [entityId], (err, result) => {
      if (err) {
          console.error('Error fetching entity:', err);
          res.status(500).send('Internal Server Error');
          return;
      }
      if (!result.length) {
          res.status(404).send('Entity not found');
          return;
      }
      res.json(result[0]); // Send the retrieved entity as JSON response
  });
});


  
  // server.js (or app.js)


// Add middleware, route handlers, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
