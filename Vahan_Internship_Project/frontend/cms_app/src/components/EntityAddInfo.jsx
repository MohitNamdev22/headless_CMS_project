import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EntityAddData = () => {
  const [formData, setFormData] = useState({});
  const [attributes, setAttributes] = useState([]);
  const { name } = useParams();

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/entities/${name}/attributes`);
        setAttributes(response.data.attributes);
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
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Add Data to {name}</h2>
      {attributes.length > 0 && ( 
        <form onSubmit={handleSubmit}>
          {attributes.map((attribute) => (
            attribute !== 'id' && (
              <div key={attribute} className="mb-4">
                <label className="block text-gray-700">{attribute}</label>
                <input
                  type="text"
                  name={attribute}
                  value={formData[attribute] || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={`Enter ${attribute}`}
                />
              </div>
            )
          ))}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default EntityAddData;
