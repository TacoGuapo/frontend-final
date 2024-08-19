// src/components/Register.jsx
import React, { useState } from 'react';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir
import './Register.css'
const Register = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Usa useNavigate para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/registrarse', { email, contraseña });
      navigate('/'); 
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = () => {
    navigate('/users/todas-las-incidencias'); 
  };

  return (
    <div className='background-register'>
      <div className='header-register'>
      <img className='logo-marca' src="../LogoMarca2.png" alt="" />
        <button type="button" onClick={handleLogin} className='back-button'>Volver</button>
      </div>
      <div className="main-register-cmp">

        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}

              required
            />
          </label>
          <button className='registrar-button' type="submit">Registrar</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;

