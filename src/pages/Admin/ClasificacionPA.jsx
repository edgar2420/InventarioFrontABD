import React, { useEffect, useState } from 'react';
import { FaPlus, FaBars, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import {
  obtenerClasificaciones,
  crearClasificacion,
  editarClasificacion,
  eliminarClasificacion,
} from '../../services/ClasificacionPAService';
import { getProductos } from '../../services/ProductoService';
import Sidebar from './Sidebar';
import logo from '../../assets/laboratoriosabd.png';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const ClasificacionPA = () => {
  const [clasificaciones, setClasificaciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ productoNombre: '', clasificacion: '' });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasificaciones();
    fetchProductos();
  }, []);

  const fetchClasificaciones = async () => {
    try {
      const data = await obtenerClasificaciones();
      setClasificaciones(data);
    } catch (error) {
      console.error("Error al cargar clasificaciones", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await editarClasificacion(idEditando, form);
      } else {
        await crearClasificacion(form);
      }
      resetForm();
      fetchClasificaciones();
    } catch (error) {
      console.error("Error al guardar clasificación", error);
    }
  };

  const handleEditar = (item) => {
    setForm({ productoNombre: item.productoNombre, clasificacion: item.clasificacion });
    setModoEdicion(true);
    setIdEditando(item.id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar esta clasificación?")) {
      await eliminarClasificacion(id);
      fetchClasificaciones();
    }
  };

  const resetForm = () => {
    setForm({ productoNombre: '', clasificacion: '' });
    setModoEdicion(false);
    setIdEditando(null);
  };

  return (
    <div className="dashboard-container full-height">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} navigate={navigate} logo={logo} />

      <div className="main-content full-height">
        <header className="navbar">
          <div>
            <FaBars
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ fontSize: '24px', cursor: 'pointer', marginRight: '20px' }}
            />
            <h1>Clasificación del Principio Activo</h1>
          </div>

          <div style={{ position: 'relative' }}>
            <FaUser
              style={{ fontSize: '24px', cursor: 'pointer', marginLeft: '20px' }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            />
            {isUserMenuOpen && (
              <div className="user-menu">
                <button onClick={() => window.location.href = "/"}>Salir</button>
              </div>
            )}
          </div>
        </header>

        <div className="table-container full-height">

          <form onSubmit={handleSubmit} className="mb-4 form-grid">
            <div>
              <label>Producto</label>
              <select
                className="form-control"
                name="productoNombre"
                value={form.productoNombre}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.nombre}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Clasificación</label>
              <select
                className="form-control"
                name="clasificacion"
                value={form.clasificacion}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="ESTABLE">ESTABLE</option>
                <option value="MENOS ESTABLE">MENOS ESTABLE</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {modoEdicion ? 'Actualizar' : 'Guardar'}
              </button>
              {modoEdicion && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Clasificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clasificaciones.map((c) => (
                <tr key={c.id}>
                  <td>{c.productoNombre}</td>
                  <td>{c.clasificacion}</td>
                  <td className="action-buttons-cell">
                    <FaEdit
                      title="Editar"
                      style={{ color: '#007bff', cursor: 'pointer', marginRight: '12px' }}
                      onClick={() => handleEditar(c)}
                    />
                    <FaTrash
                      title="Eliminar"
                      style={{ color: '#dc3545', cursor: 'pointer' }}
                      onClick={() => handleEliminar(c.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClasificacionPA;