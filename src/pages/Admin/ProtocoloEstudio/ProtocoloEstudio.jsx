import React, { useState } from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/laboratoriosabd.png";
import Sidebar from "./SidebarProtocolo"; 
import ProtocoloForm from "./ProtocoloForm";
import './ProtocoloEstudio.css';

const ProtocoloEstudio = () => {
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
      onOk: async () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="dashboard-container full-height">
      {/* Sidebar con solo el botón "Protocolo de Estudio" */}
      <Sidebar isOpen={isSidebarOpen} navigate={navigate} logo={logo} />

      {/* Contenido principal */}
      <div className="main-content full-height">
        {/* Navbar */}
        <header className="navbar">
          <div>
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
                <button
                  className="menu-button logout-button"
                  onClick={handleLogout}
                >
                  Salir
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Contenedor del formulario */}
        <div className="protocolo-container">
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Protocolo de Estudio</h1>
          <ProtocoloForm />
        </div>


      </div>
    </div>
  );
};

export default ProtocoloEstudio;
