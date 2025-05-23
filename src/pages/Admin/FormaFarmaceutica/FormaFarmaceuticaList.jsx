import React, { useState, useEffect } from 'react';
import { Table, Input, Modal, Form, Button, Space, message } from 'antd';
import {
  FaBars,
  FaUser,
  FaBox,
  FaFileAlt,
  FaClipboardList,
  FaEdit,
  FaTrash,
  FaPlus,
  FaUsers,
  FaFlask,
  FaClipboardCheck,
  FaCubes,
  FaMicroscope,
  FaVial
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/laboratoriosabd.png';
import {
  obtenerFormasFarmaceuticas,
  crearFormaFarmaceutica,
  editarFormaFarmaceutica,
  eliminarFormaFarmaceutica
} from '../../../services/FormaFarmaceuticaSevice';

const FormaFarmaceutica = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [formas, setFormas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const fetchFormas = async () => {
    try {
      const data = await obtenerFormasFarmaceuticas();
      setFormas(data);
    } catch {
      message.error('Error al obtener formas farmacéuticas');
    }
  };

  useEffect(() => {
    fetchFormas();
  }, []);

  const filteredData = formas.filter((item) =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const openEditModal = (record = null) => {
    setEditingRecord(record);
    form.setFieldsValue(record || {});
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await editarFormaFarmaceutica(editingRecord.id, values);
        message.success('Forma farmacéutica actualizada');
      } else {
        await crearFormaFarmaceutica(values);
        message.success('Forma farmacéutica creada');
      }
      setIsModalOpen(false);
      fetchFormas();
      form.resetFields();
    } catch {
      message.error('Error al guardar forma farmacéutica');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Deseas eliminar esta forma farmacéutica?')) {
      try {
        await eliminarFormaFarmaceutica(id);
        fetchFormas();
        message.success('Forma farmacéutica eliminada');
      } catch {
        message.error('Error al eliminar forma farmacéutica');
      }
    }
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    {
      title: 'Acciones',
      render: (_, record) => (
        <div className="action-buttons-cell">
          <FaEdit className="icon-edit" onClick={() => openEditModal(record)} title="Editar" />
          <FaTrash className="icon-delete" onClick={() => handleDelete(record.id)} title="Eliminar" />
        </div>
      )
    }
  ];

  return (
    <div className="dashboard-container full-height">
      <div className={`sidebar ${isSidebarOpen ? '' : 'closed'} full-height`}>
        {isSidebarOpen && (
          <>
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
          </>
        )}
      </div>

      <div className="main-content full-height">
        <header className="navbar">
          <div>
            <FaBars onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            <h1>Laboratorios ABD</h1>
          </div>
          <div className="search-container">
            <Input.Search
              placeholder="Buscar formas farmacéuticas..."
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
            <Button type="primary" icon={<FaPlus />} onClick={() => openEditModal()}>
              Nueva Forma Farmacéutica
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
            className="custom-table"
          />
        </div>

        <Modal
          title="Forma Farmacéutica"
          open={isModalOpen}
          onOk={handleSave}
          onCancel={() => setIsModalOpen(false)}
          okText="Guardar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ required: true, message: 'Ingrese el nombre de la forma farmacéutica' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default FormaFarmaceutica;
