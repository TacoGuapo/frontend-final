// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = (email, password) => {
  return api.post('/users/login', { email, password });
};

export const register = (email, password) => {
  return api.post('/users/registrarse', { email, password });
};

export const createIncidencia = (token, incidencia) => {
  return api.post('/users/mis-incidencias', incidencia, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const getIncidencias = (token) => {
  return api.get('/users/todas-las-incidencias', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export default api;
