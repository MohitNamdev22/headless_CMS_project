import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EntityForm from './components/EntityForm';
import EntityList from './components/EntityList';
import EntityAddData from './components/EntityAddInfo'; // Import EntityAddData component
import EntityUpdateForm from './components/EntityUpdateForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/entities/:tableName" element={<EntityList />} />
        <Route path="/entities" element={<EntityForm />} />
        <Route path="/entities/:name/add-data" element={<EntityAddData />} /> {/* Define the route for EntityAddData */}
        <Route path="/entities/:tableName/:id" element={<EntityUpdateForm />} />     
      </Routes>
    </Router>
  );
}

export default App;
