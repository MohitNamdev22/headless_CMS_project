import React, { useState } from 'react';

const EntityForm = () => {
  // State variables to store user input for entity attributes
  const [entityName, setEntityName] = useState('');
  const [attributes, setAttributes] = useState([{ name: '', type: '' }]);

  // Function to handle changes in entity name input
  const handleEntityNameChange = (e) => {
    setEntityName(e.target.value);
  };

  // Function to handle changes in attribute name input
  const handleAttributeNameChange = (index, e) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].name = e.target.value;
    setAttributes(updatedAttributes);
  };

  // Function to handle changes in attribute type input
  const handleAttributeTypeChange = (index, e) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].type = e.target.value;
    setAttributes(updatedAttributes);
  };

  // Function to add a new attribute field
  const addAttributeField = () => {
    setAttributes([...attributes, { name: '', type: '' }]);
  };

  // Function to remove an attribute field
  const removeAttributeField = (index) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to backend API to create entity)
    console.log({ entityName, attributes });
    // Reset form fields after submission
    setEntityName('');
    setAttributes([{ name: '', type: '' }]);
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
        {attributes.map((attribute, index) => (
          <div key={index}>
            <label>
              Attribute Name:
              <input
                type="text"
                value={attribute.name}
                onChange={(e) => handleAttributeNameChange(index, e)}
                required
              />
            </label>
            <label>
              Attribute Type:
              <input
                type="text"
                value={attribute.type}
                onChange={(e) => handleAttributeTypeChange(index, e)}
                required
              />
            </label>
            <button type="button" onClick={() => removeAttributeField(index)}>
              Remove Attribute
            </button>
          </div>
        ))}
        <button type="button" onClick={addAttributeField}>
          Add Attribute
        </button>
        <br />
        <button type="submit">Create Entity</button>
      </form>
    </div>
  );
};

export default EntityForm;
