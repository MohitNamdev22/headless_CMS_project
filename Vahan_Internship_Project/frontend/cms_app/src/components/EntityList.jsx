import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EntityList = () => {
  const [entities, setEntities] = useState([]);
  const [tableNameInput, setTableNameInput] = useState('');
  const { tableName } = useParams();
  const navigate = useNavigate();

  const fetchEntities = async (table) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/entities/${table}`);
      setEntities(response.data);
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  };

  useEffect(() => {
    fetchEntities(tableName);
  }, [tableName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate(`/entities/${tableNameInput}`);
    await fetchEntities(tableNameInput);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Entity List</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={tableNameInput}
          onChange={(e) => setTableNameInput(e.target.value)}
          placeholder="Enter table name"
          className="border border-gray-300 rounded px-4 py-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Fetch Entities</button>
      </form>
      <ul>
        {entities.map(entity => (
          <li key={entity.id} className="bg-gray-100 rounded p-2 mb-2">
            <div className="flex items-center justify-between">
              {Object.keys(entity).map(key => (
                <span key={key}><strong>{key}: </strong>{entity[key]}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntityList;
