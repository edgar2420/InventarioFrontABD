import React from "react";
import { FaBars, FaUser } from "react-icons/fa";

const NavbarProtocolo = ({ setIsSidebarOpen, isUserMenuOpen, setIsUserMenuOpen }) => {
  return (
    <header className="navbar">
      <div>
        <FaBars
          style={{ fontSize: "24px", cursor: "pointer", marginRight: "20px" }}
          onClick={() => setIsSidebarOpen(prev => !prev)}
        />
        <h1>Laboratorios ABD</h1>
      </div>
      <div style={{ position: "relative" }}>
        <FaUser
          style={{ fontSize: "24px", cursor: "pointer", marginLeft: "20px" }}
          title="Usuario"
          onClick={() => setIsUserMenuOpen(prev => !prev)}
        />
        {isUserMenuOpen && (
          <div className="user-menu">
            <button onClick={() => alert("Cerrando sesión...")}>Salir</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavbarProtocolo;
