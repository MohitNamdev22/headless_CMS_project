import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter and Route
import EntityForm from './components/EntityForm';
import EntityList from './components/EntityList'; // Import EntityList component

function App() {
  return (
    <Router> {/* Wrap your components with the Router component */}
      <Routes>
        <Route path="/entities/create" element={<EntityForm />} /> {/* Define the route for EntityForm */}
        <Route path="/entities/:tableName" element={<EntityList />} /> {/* Define the route for EntityList */}
      </Routes>
    </Router>
  );
}

export default App;
