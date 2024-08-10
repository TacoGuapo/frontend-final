import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api.js';
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', { email, contraseña });
            const { token } = response.data;

            
            localStorage.setItem('token', token);

           
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userRole = decodedToken.rol;

          
            if (userRole === 'admin') {
                navigate('/todas-las-incidencias');
            } else if (userRole === 'residente') {
                navigate('/mis-incidencias');
            } else {
                navigate('/'); 
            }
        } catch (error) {
            console.error('Error during login:', error.response ? error.response.data : error.message);
        }
    };

    const handleRegister = () => {
        navigate('/registrarse'); 
    };

    return (
        <div className='background-login'>
            <div className='header-login'>
                <img className='logo-marca' src="../LogoMarca2.png" alt="" />
                <button type="button" onClick={handleRegister} className='register-button'>Registrarse</button>
            </div>
            <div className='main-login-cmp'>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <label>
                        Email:
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
                    </label>
                    <button className='login-button' type="submit">Login</button>
                    

                </form>
            </div>
        </div>
    );
};

export default Login;


