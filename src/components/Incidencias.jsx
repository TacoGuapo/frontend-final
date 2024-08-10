import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import './Incidencias.css'; 

const Incidencias = () => {
  const [asunto, setAsunto] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [incidencias, setIncidencias] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const navigate = useNavigate(); 

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const response = await api.get('/users/mis-incidencias', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncidencias(response.data);
      } catch (err) {
        setError('Error fetching incidencias');
      }
    };

    fetchIncidencias();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        '/users/mis-incidencias',
        { asunto, tipo, descripcion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAsunto('');
      setTipo('');
      setDescripcion('');
      setSuccessMessage('Incidencia enviada exitosamente.');

    
      const response = await api.get('/users/mis-incidencias', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncidencias(response.data);
      setIsModalOpen(false); 
    } catch (err) {
      setError('Error creating incidencia');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'en proceso':
        return 'estado-en-proceso';
      case 'pendiente':
        return 'estado-en-espera';
      case 'concluido':
        return 'estado-concluido';
      default:
        return '';
    }
  };

  return (
    <div className="incidencias-container">
      <div className='header-mis-incidencias'> 
      <div className='header-mis-incidencias-right'>
      <img className='logo-marca-incidencias' src="../LogoMarca2.png" alt="" /> 
        <h1 className="incidencias-title">Incidencias</h1>
        </div>
        <div className='header-mis-incidencias-left'>
          <h1>Bienvenido Usuario!</h1>
          <img className='user-logo' src="../userLogo.svg" alt="" />
          <button  className='logout-button' onClick={handleLogout}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#d62a2a">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
            </svg></button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Crear Incidencia</h2>
            <form className="incidencias-form" onSubmit={handleSubmit}>  
              <input             
                className="incidencias-input"
                type="text"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                placeholder="Asunto"
                required
              />             
              <input
                className="incidencias-input"
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Tipo"
                required
              />
              <textarea
                className="incidencias-textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción"
                required
              ></textarea>
              <button className="incidencias-button" type="submit">Crear Incidencia</button>
              {error && <p className="incidencias-error-message incidencias-message">{error}</p>}
              {successMessage && <p className="incidencias-success-message incidencias-message">{successMessage}</p>}
            </form>
            <button className="modal-close-button" onClick={() => setIsModalOpen(false)}>Cerrar</button>
          </div>
        </div>
      )}
      <div className="incidencias-list">
        <div className='header-incidencias-list'>
          <h2>Mis Incidencias</h2>
          <button className="open-modal-button" onClick={() => setIsModalOpen(true)}>
            Crear Nueva Incidencia
          </button>
        </div>
        <div className="incidencias-content">
          {incidencias.length > 0 ? (
            <ul>
              {incidencias.map((incidencia) => (
                <li key={incidencia.id_incidencia} className="incidencias-item">
                  <div className={`incidencias-status ${getStatusClass(incidencia.estado)}`}></div>
                  <div>
                    <h3>{incidencia.asunto}</h3>
                    <div className='incidencias-tipo'>
                      <p><strong>Tipo:</strong> {incidencia.tipo}</p>
                    </div>
                    <p><strong>Descripción:</strong> {incidencia.descripcion}</p>  
                    <p><strong>Estado:</strong> {incidencia.estado}</p>                  
                    <p><strong>Fecha de Creación:</strong> {new Date(incidencia.fecha_creacion).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes incidencias registradas.</p>
          )}
        </div>
      </div>
      <div className="incidencias-guide">
        <h2>Guía de Uso</h2>
        <div className='incidencias-guide-container'>
        <h3>Aquí puedes encontrar información sobre cómo utilizar la página de incidencias:</h3>
        <ul>
          <li><strong>Crear Incidencia:</strong> Usa el botón "Crear Nueva Incidencia" para enviar un nuevo reporte.</li>
          <li><strong>Visualizar Incidencias:</strong> Todas tus incidencias se mostrarán en la lista, incluyendo su estado y descripción.</li>
          
          <li><strong>Salir:</strong> Usa el botón de salida para cerrar sesión en tu cuenta.</li>
        </ul>
        <p>Para más detalles, contacta con el soporte técnico.</p>
        <div className='logo-help'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Incidencias;






