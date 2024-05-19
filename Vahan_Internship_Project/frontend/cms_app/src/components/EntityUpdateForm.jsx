
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EntityUpdateForm = () => {
  const { tableName, id } = useParams();
  const [formData, setFormData] = useState({});
  const [entityAttributes, setEntityAttributes] = useState([]);

  useEffect(() => {
    const fetchEntityData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/entities/${tableName}/${id}`);
        setFormData(response.data);
        setEntityAttributes(Object.keys(response.data));
      } catch (error) {
        console.error('Error fetching entity data:', error);
      }
    };

    fetchEntityData();
  }, [tableName, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/entities/${tableName}/${id}`, formData);
    } catch (error) {
      console.error('Error updating entity:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Update Entity</h2>
      <form onSubmit={handleSubmit}>
        {entityAttributes.map((attribute) => (
          <div key={attribute} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{attribute}</label>
            <input
              type="text"
              name={attribute}
              value={formData[attribute] || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update</button>
      </form>
    </div>
  );
};

export default EntityUpdateForm;
