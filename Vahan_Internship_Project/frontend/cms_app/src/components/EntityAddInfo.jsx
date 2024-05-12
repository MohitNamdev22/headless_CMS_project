import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EntityAddData = () => {
  const [formData, setFormData] = useState({});
  const [attributes, setAttributes] = useState([]);
  const { name } = useParams();

  useEffect(() => {
    // Fetch attribute information for the entity from the backend
    const fetchAttributes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/entities/${name}/attributes`);
        setAttributes(response.data);
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };

    fetchAttributes();
  }, [name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/entities/${name}/add-data`, formData);
      alert('Data added successfully!');
      setFormData({});
    } catch (error) {
      console.error('Error adding data:', error);
      alert('An error occurred while adding data.');
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Data to {name}</h2>
      <form onSubmit={handleSubmit}>
        {/* Dynamically render input fields for each attribute */}
        {attributes.map((attribute) => (
          <div key={attribute.name} className="mb-4">
            <label className="block text-sm font-medium">{attribute.name}</label>
            <input
              type="text"
              name={attribute.name}
              value={formData[attribute.name] || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EntityAddData;
