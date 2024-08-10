import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Incidencias from './components/Incidencias.jsx';
import AllIncidencias from './components/AllIncidencias.jsx';

const App = () => {
  return (
    <div>
 
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/mis-incidencias" element={<Incidencias />} />
        <Route path="/todas-las-incidencias" element={<AllIncidencias />} />
      </Routes>
    </div>
  );
};

export default App;