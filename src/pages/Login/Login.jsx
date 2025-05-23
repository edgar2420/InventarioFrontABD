import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FormLogin.css';
import laboratoriosabd from './laboratoriosabd.png';
import { login } from '../../services/AuthService';

const FormLogin = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const data = await login(nombre, password);

      // ✅ Guarda correctamente el token y el rol
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role);

      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.role === 'publico') {
        navigate('/publico-dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-panel">
          <img src={laboratoriosabd} alt="Laboratorios ABD" className="logo-image" />
        </div>

        <div className="form-panel">
          <div className="form-header">
            <h1>BIENVENIDO</h1>
            <h2>INICIAR SESIÓN</h2>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="usuario">Usuario:</label>
              <input
                type="text"
                id="usuario"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="password">Contraseña:</label>
              <input
                type={mostrarPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                className="form-control"
              />
              <span
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{
                  position: 'absolute',
                  top: '38px',
                  right: '10px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="button-container">
              <button type="submit" className="login-button">
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;
