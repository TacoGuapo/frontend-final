import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import './AllIncidencias.css'; // Importa el archivo CSS
import { useNavigate } from 'react-router-dom'; 

const AllIncidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({}); // Estado para los estados seleccionados
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const response = await api.get('/users/todas-las-incidencias', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncidencias(response.data);
      } catch (err) {
        setError('Error fetching incidencias');
      }
    };

    fetchIncidencias();
  }, [token]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/users/incidencia/${id}`, { estado: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Actualiza la lista de incidencias o el estado local
      setIncidencias(incidencias.map(incidencia =>
        incidencia.id_incidencia === id
          ? { ...incidencia, estado: newStatus }
          : incidencia
      ));
      // Actualiza el estado seleccionado
      setSelectedStatus(prev => ({ ...prev, [id]: newStatus }));
    } catch (err) {
      console.error('Error updating estado:', err.response ? err.response.data : err.message);
      setError('Error updating estado');
    }
  };

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'en proceso':
        return 'all-estado-en-proceso';
      case 'pendiente':
        return 'all-estado-en-espera';
      case 'concluido':
        return 'all-estado-concluido';
      default:
        return '';
    }
  };

  const handleRegister = () => {
    navigate('/registrarse'); 
};

  // Filtra incidencias por estado
  const incidenciasEnProceso = incidencias.filter(inc => inc.estado === 'en proceso');
  const incidenciasPendientes = incidencias.filter(inc => inc.estado === 'pendiente');
  const incidenciasConcluidas = incidencias.filter(inc => inc.estado === 'concluido');

  return (
    <div className="all-incidencias-container">
      <div className='all-header-incidencias'>
        <div className='all-header-incidencias-right'>
          <img className='logo-marca-incidencias' src="../LogoMarca2.png" alt="" />
          <h1 className="incidencias-title">Todas las Incidencias</h1>
        </div>
        <div className='all-header-incidencias-left'>
          <button type="button" onClick={handleRegister} className='register-button'>Registrar</button>
          <h1>Bienvenido Admin!</h1>
          <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#e8eaed"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
          <button className='all-logout-button' onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
          </button>
        </div>
      </div>

      {error && <p className="incidencias-error-message incidencias-message">{error}</p>}

      <div className="all-incidencias-list">
        <div className='all-header-incidencias-list'>
          <h2>Todas las Incidencias</h2>
        </div>

        <div className="all-incidencias-columns">
        <div className="incidencias-column-pendiente">
            <h3>Pendientes</h3>
            <div className="all-incidencias-content">
              {incidenciasPendientes.length > 0 ? (
                <ul>
                  {incidenciasPendientes.map((incidencia) => (
                    <li key={incidencia.id_incidencia} className="all-incidencias-item-pendiente">
                      <div>
                        <h4>{incidencia.asunto}</h4>
                        <div className='incidencias-tipo'>
                          <p><strong>Tipo:</strong> {incidencia.tipo}</p>
                        </div>
                        <p><strong>Descripción:</strong> {incidencia.descripcion}</p>
                        <p><strong>Estado:</strong>
                          <select
                            value={selectedStatus[incidencia.id_incidencia] || incidencia.estado}
                            onChange={(e) => handleStatusChange(incidencia.id_incidencia, e.target.value)}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en proceso">En Proceso</option>
                            <option value="concluido">Concluido</option>
                          </select>
                        </p>
                        <p><strong>Fecha de Creación:</strong> {new Date(incidencia.fecha_creacion).toLocaleDateString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay incidencias pendientes.</p>
              )}
            </div>
          </div>
          <div className="incidencias-column-proceso">
            <h3>En Proceso</h3>
            <div className="all-incidencias-content">
              {incidenciasEnProceso.length > 0 ? (
                <ul>
                  {incidenciasEnProceso.map((incidencia) => (
                    <li key={incidencia.id_incidencia} className="all-incidencias-item-proceso">
                      <div className={`all-incidencias-status ${getStatusClass(incidencia.estado)}`}></div>
                      <div>
                        <h4>{incidencia.asunto}</h4>
                        <div className='incidencias-tipo'>
                          <p><strong>Tipo:</strong> {incidencia.tipo}</p>
                        </div>
                        <p><strong>Descripción:</strong> {incidencia.descripcion}</p>
                        <p><strong>Estado:</strong>
                          <select
                            value={selectedStatus[incidencia.id_incidencia] || incidencia.estado}
                            onChange={(e) => handleStatusChange(incidencia.id_incidencia, e.target.value)}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en proceso">En Proceso</option>
                            <option value="concluido">Concluido</option>
                          </select>
                        </p>
                        <p><strong>Fecha de Creación:</strong> {new Date(incidencia.fecha_creacion).toLocaleDateString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay incidencias en proceso.</p>
              )}
            </div>
          </div>

          

          <div className="incidencias-column-concluida">
            <h3>Concluidas</h3>
            <div className="all-incidencias-content">
              {incidenciasConcluidas.length > 0 ? (
                <ul>
                  {incidenciasConcluidas.map((incidencia) => (
                    <li key={incidencia.id_incidencia} className="all-incidencias-item-concluidas">
                      <div className={`all-incidencias-status ${getStatusClass(incidencia.estado)}`}></div>
                      <div>
                        <h4>{incidencia.asunto}</h4>
                        <div className='incidencias-tipo'>
                          <p><strong>Tipo:</strong> {incidencia.tipo}</p>
                        </div>
                        <p><strong>Descripción:</strong> {incidencia.descripcion}</p>
                        <p><strong>Estado:</strong>
                          <select
                            value={selectedStatus[incidencia.id_incidencia] || incidencia.estado}
                            onChange={(e) => handleStatusChange(incidencia.id_incidencia, e.target.value)}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en proceso">En Proceso</option>
                            <option value="concluido">Concluido</option>
                          </select>
                        </p>
                        <p><strong>Fecha de Creación:</strong> {new Date(incidencia.fecha_creacion).toLocaleDateString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay incidencias concluidas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllIncidencias;



