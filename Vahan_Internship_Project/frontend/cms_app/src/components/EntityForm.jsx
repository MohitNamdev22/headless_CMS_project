import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';


const EntityForm = () => {
  const validAttributeTypes = ['INT', 'VARCHAR', 'TEXT', 'DATE', 'BOOLEAN'];

  const [entityName, setEntityName] = useState('');
  const [attributeName, setAttributeName] = useState('');
  const [attributeType, setAttributeType] = useState('');
  const [attributes, setAttributes] = useState([]);

  const handleEntityNameChange = (e) => {
    setEntityName(e.target.value);
  };

  const handleAttributeNameChange = (e) => {
    setAttributeName(e.target.value);
  };

  const handleAttributeTypeChange = (e) => {
    setAttributeType(e.target.value);
  };

  const addAttributeField = () => {
    if (attributeName && attributeType) {
      setAttributes([...attributes, { name: attributeName, type: attributeType }]);
      setAttributeName('');
      setAttributeType('');
    }
  };

  const removeAttributeField = (index) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/entities', {
        name: entityName,
        attributes
      });
      console.log(response.data);
      setEntityName('');
      setAttributes([]);
      alert('Entity Created Successfully');
      history.push('/entity-list')
    } catch (error) {
      console.error('Error creating entity:', error);
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Entity</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">
            Entity Name:
            <input className="mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" type="text" value={entityName} onChange={handleEntityNameChange} required />
          </label>
        </div>
        <div className="mb-4">
          <h3 className="text-gray-800 mb-2">Attributes:</h3>
          <div className="flex items-center mb-2">
            <label className="block text-gray-800 mr-4">
              Attribute Name:
              <input className="mt-1 block rounded-md border border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" type="text" value={attributeName} onChange={handleAttributeNameChange} required />
            </label>
            <label className="block text-gray-800 mr-4">
              Attribute Type:
              <select className="mt-1 block rounded-md border border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" value={attributeType} onChange={handleAttributeTypeChange} required>
                <option value="">Select Type</option>
                {validAttributeTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <button type="button" onClick={addAttributeField} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Attribute</button>
          </div>
        </div>
        {attributes.map((attribute, index) => (
          <div key={index} className="flex items-center mb-2">
            <span className="text-gray-800">{attribute.name} ({attribute.type})</span>
            <button type="button" onClick={() => removeAttributeField(index)} className="ml-4 px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">Remove Attribute</button>
            
          </div>
        ))}
        <div className="mt-4">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Create Entity</button>
          <Link to={"/entities/table/"} className="px-4 py-2 mx-2 bg-green-600 text-white rounded-md hover:bg-green-700">Add Data</Link>
        </div>
      </form>
    </div>
  );
};

export default EntityForm;
