import React from 'react';
import {
  FaBox,
  FaFileAlt,
  FaFlask,
  FaClipboardCheck,
  FaCubes,
  FaMicroscope,
  FaVial
} from 'react-icons/fa';

const SidebarProtocolo = ({ isOpen, navigate, logo }) => {
  return (
    <div className={`sidebar ${isOpen ? '' : 'closed'} full-height`}>
      <img src={logo} alt="Laboratorios ABD" />
      <nav>
        <ul>
          <li>
            <button className="menu-button" onClick={() => navigate('/admin-dashboard')}>
              <FaBox style={{ marginRight: '10px' }} /> PRODUCTOS
            </button>
          </li>
          <li>
            <button className="menu-button" onClick={() => navigate('/protocolo-estudio')}>
              <FaFileAlt style={{ marginRight: '10px' }} /> PROTOCOLO DE ESTUDIO
            </button>
          </li>
          <li>
            <button className="menu-button" onClick={() => navigate('/forma-farmaceutica')}>
              <FaFlask style={{ marginRight: '10px' }} /> FORMA FARMACÉUTICA
            </button>
          </li>
          <li>
            <button className="menu-button" onClick={() => navigate('/formula-cualitativa')}>
              <FaCubes style={{ marginRight: '10px' }} /> FÓRMULA CUALITATIVA
            </button>
          </li>
          <li>
            <button className="menu-button" onClick={() => navigate('/clasificacion_pa')}>
              <FaMicroscope style={{ marginRight: '10px' }} /> CLASIFICACIÓN PA
            </button>
          </li>
          <li>
            <button className="menu-button" onClick={() => navigate('/valoraciones')}>
              <FaVial style={{ marginRight: '10px' }} /> VALORACIONES
            </button>
          </li>
          <li>
            <button className="menu-button" onClick={() => navigate('/frecuencia-muestreo')}>
              <FaVial style={{ marginRight: '10px' }} /> FRECUENCIA MUESTREO
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarProtocolo;
