import React, { useState } from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/laboratoriosabd.png';
import ProtocoloForm from '../Admin/ProtocoloEstudio/ProtocoloForm';
import '../Admin/AdminDashboard.css';

const Publico = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Modal.confirm({
      title: "¿Estás seguro de cerrar sesión?",
      content: "Tu sesión será cerrada y volverás a la pantalla de inicio.",
      okText: "Sí, cerrar sesión",
      cancelText: "Cancelar",
      centered: true,
      onOk: () => navigate("/")
    });
  };

  return (
    <div className="dashboard-container full-height">
      {/* Sidebar simple */}
      <div className={`sidebar ${isSidebarOpen ? '' : 'closed'} full-height`}>
        <img src={logo} alt="Laboratorios ABD" className="sidebar-logo" />
        <nav>
          <ul>
            <li>
              <button className="menu-button">PROTOCOLO DE ESTUDIO</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="main-content full-height">
        <header className="navbar">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaBars
              style={{ fontSize: '24px', cursor: 'pointer', marginRight: '20px' }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <h1>Laboratorios ABD</h1>
          </div>
          <div style={{ position: 'relative' }}>
            <FaUser
              style={{ fontSize: '24px', cursor: 'pointer', marginLeft: '20px' }}
              title="Usuario"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            />
            {isUserMenuOpen && (
              <div className="user-menu">
                <button className="menu-button logout-button" onClick={handleLogout}>
                  Salir
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="protocolo-container">
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Protocolo de Estudio</h1>
          <ProtocoloForm />
        </div>
      </div>
    </div>
  );
};

export default Publico;
