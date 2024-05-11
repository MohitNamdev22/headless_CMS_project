const mysql = require('mysql2');
const config = require('../config/config');
const express = require('express');
const { z } = require('zod');
const app = express();

app.use(express.json())
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

const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};

// Define Zod schema for entity
const entitySchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(10, 'Mobile number should be at least 10 characters'),
  dateOfBirth: z.string().date('Invalid date of birth'),
});

// Middleware to validate entity creation request
const validateCreateEntity = validateSchema(entitySchema);

// Middleware to validate entity update request
const validateUpdateEntity = validateSchema(
  entitySchema.partial() // Allow partial updates
);

// Middleware to validate entity ID parameter
const validateEntityId = (req, res, next) => {
  if (!req.params.id) {
    res.status(400).json({ error: 'Entity ID is required' });
  } else {
    next();
  }
};


// server.js (or app.js)

// Define route for fetching all entities

app.post('/api/entities', validateCreateEntity, (req, res) => {
  console.log("post started")
  const { name, email, mobileNumber, dateOfBirth } = req.body; // Assuming request body contains entity data
  console.log("taken data from body")
  const sql = 'INSERT INTO entities (name, email, mobileNumber, dateOfBirth) VALUES (?, ?, ?, ?)';
  console.log("query run")
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
app.get('/api/entities/:id', validateEntityId, (req, res) => {
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
          res.status(404).send('No entry for this particular ID, please check ID');
          return;
      }
      res.json(result[0]); // Send the retrieved entity as JSON response
  });
});

// Define a route for updating an existing entity
app.put('/api/entities/:id', validateEntityId, validateUpdateEntity,(req, res) => {
  const entityId = req.params.id;
  const { name, email, mobileNumber, dateOfBirth } = req.body; // Updated entity data

  // Check if entity ID is provided
  if (!entityId) {
      res.status(400).json({ error: 'Entity ID is required' });
      return;
  }

  // Execute the database query to update the entity
  const sql = 'UPDATE entities SET name=?, email=?, mobileNumber=?, dateOfBirth=? WHERE id=?';
  pool.query(sql, [name, email, mobileNumber, dateOfBirth, entityId], (err, result) => {
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
app.delete('/api/entities/:id', validateEntityId, (req, res) => {
  const entityId = req.params.id;

  // Check if entity ID is provided
  if (!entityId) {
      res.status(400).json({ error: 'Entity ID is required' });
      return;
  }

  // Execute the database query to delete the entity
  const sql = 'DELETE FROM entities WHERE id=?';
  pool.query(sql, [entityId], (err, result) => {
      if (err) {
          console.error('Error deleting entity:', err);
          res.status(500).send('Internal Server Error');
          return;
      }
      console.log('Entity deleted successfully!');
      res.status(200).send('Entity deleted successfully!');
  });
});


  
  // server.js (or app.js)


// Add middleware, route handlers, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
