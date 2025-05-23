import React, { useEffect, useState } from 'react';
import { message, Modal, Table, Tooltip, Button, Card } from 'antd';
import { FaBars, FaEdit, FaTrash, FaPlus, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SidebarProtocolo from './SidebarProtocolo';
import logo from '../../../assets/laboratoriosabd.png';
import FrecuenciaFormModal from './FrecuenciaFormModal';
import {
  editarFrecuencia,
  eliminarFrecuencia,
  crearFrecuencia,
  obtenerTodasFrecuencias
} from '../../../services/FrecuenciaMuestreoProductoService';
import { getProductos } from '../../../services/ProductoService';

const FrecuenciaMuestreoPage = () => {
  const [frecuencias, setFrecuencias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cargarFrecuencias = async () => {
    try {
      const data = await obtenerTodasFrecuencias();
      setFrecuencias(data);
    } catch {
      message.error("Error al cargar frecuencias de muestreo");
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch {
      message.error("Error al cargar productos");
    }
  };

  useEffect(() => {
    cargarFrecuencias();
    cargarProductos();
  }, []);

  const abrirModalCrear = () => {
    setEditando(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (item) => {
    setEditando(item);
    setModalVisible(true);
  };

  const manejarGuardar = async (datos) => {
    try {
      if (editando) {
        await editarFrecuencia(editando.id, datos);
        message.success("Frecuencia actualizada ✅");
      } else {
        await crearFrecuencia(datos);
        message.success("Frecuencia creada ✅");
      }
      setModalVisible(false);
      cargarFrecuencias();
    } catch {
      message.error("Error al guardar frecuencia ❌");
    }
  };

  const manejarEliminar = (id) => {
    Modal.confirm({
      title: "¿Eliminar frecuencia?",
      content: "Esta acción no se puede deshacer.",
      okType: "danger",
      onOk: async () => {
        try {
          await eliminarFrecuencia(id);
          message.success("Frecuencia eliminada 🗑️");
          cargarFrecuencias();
        } catch {
          message.error("Error al eliminar frecuencia");
        }
      }
    });
  };

  const columns = [
    { title: 'Producto', dataIndex: 'productoNombre', key: 'productoNombre' },
    { title: 'pH', dataIndex: 'ph', key: 'ph' },
    { title: 'Valoración', dataIndex: 'valoracion', key: 'valoracion' },
    { title: 'Partículas Visibles', dataIndex: 'particulas_visibles', key: 'particulas_visibles' },
    { title: 'Pruebas Microbiológicas', dataIndex: 'pruebas_microbiologicas', key: 'pruebas_microbiologicas' },
    { title: 'Rectificación', dataIndex: 'rectificacion', key: 'rectificacion' },
    { title: 'Aspecto', dataIndex: 'aspecto', key: 'aspecto' },
    { title: 'Hermeticidad', dataIndex: 'hermeticidad', key: 'hermeticidad' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <div className="action-buttons-cell" style={{ display: 'flex', gap: '8px' }}>
          <Tooltip title="Editar">
            <span>
              <FaEdit className="icon-edit" onClick={() => abrirModalEditar(record)} style={{ cursor: 'pointer' }} />
            </span>
          </Tooltip>
          <Tooltip title="Eliminar">
            <span>
              <FaTrash className="icon-delete" onClick={() => manejarEliminar(record.id)} style={{ cursor: 'pointer' }} />
            </span>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div className="dashboard-container full-height">
      <SidebarProtocolo
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        logo={logo}
        navigate={(path) => window.location.href = path}
      />

      <div className="main-content full-height">
        <header className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaBars
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ fontSize: '24px', cursor: 'pointer', marginRight: '20px' }}
            />
            <h1>Frecuencia de Muestreo</h1>
          </div>

          <div style={{ position: 'relative' }}>
            <FaUser
              style={{ fontSize: '24px', cursor: 'pointer' }}
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
                      onOk: () => navigate("/")
                    });
                  }}
                >
                  Salir
                </button>
              </div>
            )}
          </div>
        </header>

        <Card
          title="Listado de Frecuencias"
          style={{ margin: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          extra={
            <Button type="primary" icon={<FaPlus />} onClick={abrirModalCrear}>
              Nueva Frecuencia
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={frecuencias}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
            className="custom-table"
          />
        </Card>

        <FrecuenciaFormModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={manejarGuardar}
          productos={productos}
          frecuenciaInicial={editando}
        />
      </div>
    </div>
  );
};

export default FrecuenciaMuestreoPage;
