import React, { useState } from 'react';
import axios from 'axios';

const EntityForm = () => {
  // Define an array of valid attribute types
  const validAttributeTypes = ['INT', 'VARCHAR', 'TEXT', 'DATE', 'BOOLEAN']; // Add more types as needed

  // State variables to store user input for entity attributes
  const [entityName, setEntityName] = useState('');
  const [attributeName, setAttributeName] = useState('');
  const [attributeType, setAttributeType] = useState('');
  const [attributes, setAttributes] = useState([]);

  // Function to handle changes in entity name input
  const handleEntityNameChange = (e) => {
    setEntityName(e.target.value);
  };

  // Function to handle changes in attribute name input
  const handleAttributeNameChange = (e) => {
    setAttributeName(e.target.value);
  };

  // Function to handle changes in attribute type input
  const handleAttributeTypeChange = (e) => {
    setAttributeType(e.target.value);
  };

  // Function to add a new attribute field
  const addAttributeField = () => {
    if (attributeName && attributeType) {
      setAttributes([...attributes, { name: attributeName, type: attributeType }]);
      setAttributeName('');
      setAttributeType('');
    }
  };

  // Function to remove an attribute field
  const removeAttributeField = (index) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to the backend API endpoint to create the entity
      const response = await axios.post('http://localhost:3000/api/entities', {
        name: entityName,
        attributes
      });
      console.log(response.data); // Log the response from the backend
      // Reset form fields after successful submission
      setEntityName('');
      setAttributes([]);
    } catch (error) {
      console.error('Error creating entity:', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  return (
    <div className='bg-red-700 p-4 rounded-lg shadow'>
      <h2 className="text-2xl font-bold mb-4">Create New Entity</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Entity Name:
          <input className='' type="text" value={entityName} onChange={handleEntityNameChange} required />
        </label>
        <br />
        <h3>Attributes:</h3>
        <div>
          <label>
            Attribute Name:
            <input
              type="text"
              value={attributeName}
              onChange={handleAttributeNameChange}
              required
            />
          </label>
          <label>
            Attribute Type:
            <select value={attributeType} onChange={handleAttributeTypeChange} required>
              <option value="">Select Type</option>
              {validAttributeTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={addAttributeField}>
            Add Attribute
          </button>
        </div>
        <br />
        {attributes.map((attribute, index) => (
          <div key={index}>
            <span>{attribute.name} ({attribute.type})</span>
            <button type="button" onClick={() => removeAttributeField(index)}>
              Remove Attribute
            </button>
          </div>
        ))}
        <br />
        <button type="submit">Create Entity</button>
      </form>
    </div>
  );
};

export default EntityForm;
