import React, { useState, useEffect } from 'react';
import { Input, Modal, Form, InputNumber, Button } from 'antd';
import { FaBars, FaUser, FaEdit, FaTrash, FaFileExcel, FaPlus } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/laboratoriosabd.png';
import Sidebar from './Sidebar';
import './AdminDashboard.css';
import {
  getEspecificaciones,
  eliminarEspecificacion,
  editarEspecificacion,
  crearEspecificacion
} from '../../services/EspecificacionesService';

const Especificaciones = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const fetchEspecificaciones = async () => {
    try {
      const especificaciones = await getEspecificaciones();
      const processed = especificaciones.map(item => ({
        ...item,
        nombre_producto: item.nombre_producto || "N/A"
      }));
      setData(processed);
    } catch (error) {
      console.error("Error al obtener especificaciones", error);
    }
  };

  useEffect(() => {
    fetchEspecificaciones();
  }, []);

  const filteredData = data.filter((item) =>
    item.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Especificaciones');
    XLSX.writeFile(workbook, 'Especificaciones.xlsx');
  };

  const openEditModal = (record = null) => {
    setEditingRecord(record);
    form.setFieldsValue(record || {});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar esta especificación?")) {
      try {
        await eliminarEspecificacion(id);
        fetchEspecificaciones();
      } catch {
        alert("Error al eliminar la especificación");
      }
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await editarEspecificacion(editingRecord.id, values);
      } else {
        await crearEspecificacion(values);
      }
      setIsModalOpen(false);
      fetchEspecificaciones();
    } catch (err) {
      console.error("Error al guardar especificación", err);
    }
  };

  return (
    <div className="dashboard-container full-height">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} navigate={navigate} logo={logo} />
      <div className="main-content full-height">
        <header className="navbar">
          <div>
            <FaBars onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ fontSize: '24px', cursor: 'pointer', marginRight: '20px' }} />
            <h1>Laboratorios ABD</h1>
          </div>
          <div className="search-container">
            <Input.Search
              placeholder="Buscar especificaciones..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          </div>
          <div style={{ position: 'relative' }}>
            <FaUser
              style={{ fontSize: '24px', cursor: 'pointer', marginLeft: '20px' }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            />
            {isUserMenuOpen && (
              <div className="user-menu">
                <button
                  className="menu-button logout-button"
                  onClick={() => {
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
                  }}
                >
                  Salir
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="table-container full-height">
          <div className="action-buttons compact">
            <FaFileExcel className="icon-action" onClick={handleExportExcel} title="Exportar Excel" />
            <FaPlus className="icon-action" onClick={() => openEditModal()} title="Agregar Especificación" />
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Volumen</th>
                  <th>Aspecto</th>
                  <th>Hermeticidad</th>
                  <th>pH Min</th>
                  <th>pH Max</th>
                  <th>Conductividad</th>
                  <th>Impurezas</th>
                  <th>Pruebas Microbiológicas</th>
                  <th>Esterilidad</th>
                  <th>Endotoxinas</th>
                  <th>Referencia Documental</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nombre_producto}</td>
                    <td>{item.volumen}</td>
                    <td>{item.aspecto}</td>
                    <td>{item.hermeticidad}</td>
                    <td>{item.ph_min}</td>
                    <td>{item.ph_max}</td>
                    <td>{item.conductividad}</td>
                    <td>{item.impurezas}</td>
                    <td>{item.pruebas_microbiologicas}</td>
                    <td>{item.esterilidad}</td>
                    <td>{item.endotoxinas}</td>
                    <td>{item.referencia_documental}</td>
                    <td className="action-buttons-cell">
                      <FaEdit className="icon-edit" onClick={() => openEditModal(item)} title="Editar" />
                      <FaTrash className="icon-delete" onClick={() => handleDelete(item.id)} title="Eliminar" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          title={editingRecord ? "Editar Especificación" : "Nueva Especificación"}
          open={isModalOpen}
          onOk={handleSave}
          onCancel={() => setIsModalOpen(false)}
          okText="Guardar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="aspecto" label="Aspecto"><Input /></Form.Item>
            <Form.Item name="hermeticidad" label="Hermeticidad"><Input /></Form.Item>
            <Form.Item name="ph_min" label="pH Mínimo"><InputNumber style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="ph_max" label="pH Máximo"><InputNumber style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="conductividad" label="Conductividad"><Input /></Form.Item>
            <Form.Item name="impurezas" label="Impurezas"><Input /></Form.Item>
            <Form.Item name="pruebas_microbiologicas" label="Pruebas Microbiológicas"><Input /></Form.Item>
            <Form.Item name="esterilidad" label="Esterilidad"><Input /></Form.Item>
            <Form.Item name="endotoxinas" label="Endotoxinas"><Input /></Form.Item>
            <Form.Item name="referencia_documental" label="Referencia Documental"><Input /></Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Especificaciones;
