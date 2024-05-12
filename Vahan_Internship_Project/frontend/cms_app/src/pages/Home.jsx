// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto mt-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Headless CMS Application</h1>
        <p className="mt-2 text-lg text-gray-700">Build and manage content dynamically with ease</p>
      </header>
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Create</h3>
            <p>Create new entities and add data</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Read</h3>
            <p>View and retrieve existing entities and their data</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Update</h3>
            <p>Edit and update existing entity data</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Delete</h3>
            <p>Delete entities and their associated data</p>
          </div>
        </div>
      </section>
      <section className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Get Started</h2>
        <p className="mb-4">Get started with creating and managing your content!</p>
        <Link to={`/entities/`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create New Entity</Link>
      </section>
    </div>
  );
};

export default Home;
