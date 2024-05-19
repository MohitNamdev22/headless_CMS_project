const mysql = require('mysql2');
const config = require('../config/config');
const express = require('express');
const cors = require('cors');
const router = express.Router();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool(config.database);


pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database successfully!');
  connection.release();
});

app.post('/api/entities', (req, res) => {
  const { name, attributes } = req.body;
  const columnDefinitions = attributes.map(attr => {
    if (attr.type === 'VARCHAR') {
      return `${attr.name} ${attr.type}(${attr.length || 255})`;
    }
    return `${attr.name} ${attr.type}`;
  }).join(', ');

  const createTableQuery = `CREATE TABLE IF NOT EXISTS ${name} (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ${columnDefinitions}
  )`;

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


app.post('/api/entities/:name/add-data', (req, res) => {
  const { name } = req.params;
  const data = req.body; 

  const insertDataQuery = `INSERT INTO ${name} (${Object.keys(data).join(',')}) VALUES (${Object.values(data).map(value => `'${value}'`).join(',')})`;
  pool.query(insertDataQuery, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Data inserted successfully!');
    res.status(201).send('Data inserted successfully!');
  });
});

app.get('/api/entities/:name/attributes', (req, res) => {
  console.log("control reached in attribute")
  const { name } = req.params;

  const getAttributesQuery = `DESCRIBE ${name}`;

 
  pool.query(getAttributesQuery, (err, results) => {
    if (err) {
      console.error('Error fetching attributes:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    
    const attributes = results.map(row => row.Field);
    res.json({ attributes });   
  });
});


app.get('/api/entities/:name', (req, res) => {
  const { name } = req.params;

  const sql = `SELECT * FROM ${name}`;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching entries:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});


app.get('/api/entities/:name/:id', (req, res) => {
  const { name, id } = req.params;

  if(!name) {
    res.status(400).json({error:'Entity name is required'});
    return;
  }
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

app.put('/api/entities/:name/:id', (req, res) => {
  const { name, id } = req.params;
  const attributes = req.body; 

  if (!id) {
    res.status(400).json({ error: 'Entity ID is required' });
    return;
  }

  const setClause = Object.keys(attributes).map(attr => `${attr} = ?`).join(', ');
  const values = Object.values(attributes);

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


app.delete('/api/entities/:name/:id', (req, res) => {
  const { name, id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'Entity ID is required' });
    return;
  }

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
