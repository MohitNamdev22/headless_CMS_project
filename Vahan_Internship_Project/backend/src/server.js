const mysql = require('mysql2');
const config = require('../config/config');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Define route for creating a new entity and its corresponding table
app.post('/api/entities', (req, res) => {
  const { name, attributes } = req.body;
  const createTableQuery = `CREATE TABLE IF NOT EXISTS ${name} (${attributes.map(attr => `${attr.name} ${attr.type}`).join(', ')})`;
  pool.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Table created successfully!');
    res.status(201).send('Table created successfully!');
  });
});

// Define route for adding attributes to an existing entity table
app.post('/api/entities/:name/add-attributes', (req, res) => {
  const { name } = req.params;
  const { attributes } = req.body;

  // Check if the table exists
  const checkTableQuery = `SHOW TABLES LIKE '${name}'`;
  pool.query(checkTableQuery, (err, result) => {
    if (err) {
      console.error('Error checking table:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (result.length === 0) {
      res.status(404).send('Table does not exist');
      return;
    }

    // Alter the table to add new attributes
    const alterTableQuery = `ALTER TABLE ${name} ${attributes.map(attr => `ADD COLUMN ${attr.name} ${attr.type}`).join(', ')}`;
    pool.query(alterTableQuery, (err, result) => {
      if (err) {
        console.error('Error adding attributes to table:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      console.log('Attributes added to table successfully!');
      res.status(200).send('Attributes added to table successfully!');
    });
  });
});


// Define route for fetching all entities
app.get('/api/entities', (req, res) => {
  const sql = 'SELECT * FROM entities';
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching entities:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

// Define route for fetching a single entity by ID
app.get('/api/entities/:name/:id', (req, res) => {
  const { name, id } = req.params;
  const sql = `SELECT * FROM ${name} WHERE id = ?`;
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching entity:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (!result.length) {
      res.status(404).send('No entry for this particular ID, please check ID');
      return;
    }
    res.json(result[0]);
  });
});

// Define a route for updating an existing entity
app.put('/api/entities/:name/:id', (req, res) => {
  const { name, id } = req.params;
  const { attributes } = req.body; // Updated entity data

  // Check if entity ID is provided
  if (!id) {
    res.status(400).json({ error: 'Entity ID is required' });
    return;
  }

  // Build the SET part of the SQL query dynamically based on the provided attributes
  const setClause = attributes.map(attr => `${attr.name} = ?`).join(', ');
  const values = attributes.map(attr => attr.value);

  // Execute the database query to update the entity
  const sql = `UPDATE ${name} SET ${setClause} WHERE id = ?`;
  pool.query(sql, [...values, id], (err, result) => {
    if (err) {
      console.error('Error updating entity:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Entity updated successfully!');
    res.status(200).send('Entity updated successfully!');
  });
});

// Define a route for deleting an existing entity
app.delete('/api/entities/:name/:id', (req, res) => {
  const { name, id } = req.params;

  // Check if entity ID is provided
  if (!id) {
    res.status(400).json({ error: 'Entity ID is required' });
    return;
  }

  // Execute the database query to delete the entity
  const sql = `DELETE FROM ${name} WHERE id = ?`;
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting entity:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Entity deleted successfully!');
    res.status(200).send('Entity deleted successfully!');
  });
});

// Add middleware, route handlers, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
