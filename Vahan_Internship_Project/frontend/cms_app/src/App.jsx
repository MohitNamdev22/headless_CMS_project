import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EntityForm from './components/EntityForm';
import EntityList from './components/EntityList';
import EntityAddData from './components/EntityAddInfo';
import EntityUpdateForm from './components/EntityUpdateForm';
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/entities/:tableName" element={<EntityList />} />
        <Route path="/entities" element={<EntityForm />} />
        <Route path="/entities/:name/add-data" element={<EntityAddData />} />
        <Route path="/entities/:tableName/:id" element={<EntityUpdateForm />} />     
      </Routes>
    </Router>
  );
}

export default App;
