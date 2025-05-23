import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Input, Form, message, Select, Card } from 'antd';
import { FaBars, FaUser, FaPlus, FaEdit, FaTrash, FaLink } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/laboratoriosabd.png';
import Sidebar from './Sidebar';
import {
  obtenerValoraciones,
  crearValoracion,
  editarValoracion,
  eliminarValoracion,
  asignarValoraciones,
  obtenerProductosConValoraciones
} from '../../services/ValoracionService';
import { getProductos } from '../../services/ProductoService';

const Valoraciones = () => {
  const [valoraciones, setValoraciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosConValoraciones, setProductosConValoraciones] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAsignarModalOpen, setIsAsignarModalOpen] = useState(false);
  const [valoracionEditando, setValoracionEditando] = useState(null);
  const [form] = Form.useForm();
  const [asignarForm] = Form.useForm();
  const navigate = useNavigate();

  const fetchValoraciones = async () => {
    try {
      const data = await obtenerValoraciones();
      setValoraciones(data);
    } catch {
      message.error('Error al obtener valoraciones');
    }
  };

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch {
      message.error('Error al obtener productos');
    }
  };

  const fetchProductosConValoraciones = async () => {
    try {
      const data = await obtenerProductosConValoraciones();
      setProductosConValoraciones(data);
    } catch {
      message.error('Error al obtener productos con valoraciones');
    }
  };

  useEffect(() => {
    fetchValoraciones();
    fetchProductos();
    fetchProductosConValoraciones();
  }, []);

  const openModal = (record = null) => {
    if (record) {
      const [min, max] = record.rango.replace(/%/g, '').split(' - ').map(parseFloat);
      form.setFieldsValue({
        nombre: record.nombre,
        rangoMin: min,
        rangoMax: max || ''
      });
    } else {
      form.resetFields();
    }

    setValoracionEditando(record);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const rangoMin = parseFloat(values.rangoMin);
      const rangoMax = parseFloat(values.rangoMax);

      if (isNaN(rangoMin) || isNaN(rangoMax)) {
        return message.error('Ambos rangos deben ser numéricos válidos');
      }

      if (rangoMin > rangoMax) {
        return message.error('El rango mínimo no puede ser mayor al máximo');
      }

      const payload = {
        nombre: values.nombre.trim(),
        rango: `${rangoMin.toFixed(2)}% - ${rangoMax.toFixed(2)}%`
      };

      if (valoracionEditando) {
        await editarValoracion(valoracionEditando.id, payload);
        message.success('Valoración actualizada ✅');
      } else {
        await crearValoracion(payload);
        message.success('Valoración creada ✅');
      }

      setIsModalOpen(false);
      form.resetFields();
      setValoracionEditando(null);
      fetchValoraciones();
      fetchProductosConValoraciones();
    } catch {
      message.error('Error al guardar valoración ❌');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '¿Eliminar esta valoración?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        try {
          await eliminarValoracion(id);
          message.success('Valoración eliminada ✅');
          fetchValoraciones();
          fetchProductosConValoraciones();
        } catch {
          message.error('Error al eliminar valoración ❌');
        }
      },
    });
  };

  const handleAsignar = async () => {
    try {
      const values = await asignarForm.validateFields();
      await asignarValoraciones({
        productoId: values.productoId,
        valoracionIds: values.valoracionIds
      });
      message.success('Valoraciones asignadas ✅');
      setIsAsignarModalOpen(false);
      asignarForm.resetFields();
      fetchProductosConValoraciones();
    } catch {
      message.error('Error al asignar valoraciones ❌');
    }
  };

  const columnsValoraciones = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Rango', dataIndex: 'rango', key: 'rango' },
    {
      title: 'Acciones',
      render: (_, record) => (
        <div className="action-buttons-cell">
          <FaEdit className="icon-edit" onClick={() => openModal(record)} title="Editar" />
          <FaTrash className="icon-delete" onClick={() => handleDelete(record.id)} title="Eliminar" />
        </div>
      )
    }
  ];

  const columnsProductos = [
    { title: 'Producto', dataIndex: 'nombre', key: 'nombre' },
    {
      title: 'Valoraciones asignadas',
      dataIndex: 'valoraciones',
      key: 'valoraciones',
      render: (valoraciones) => valoraciones?.map(v => v.nombre).join(', ') || '—'
    }
  ];

  return (
    <div className="dashboard-container full-height">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} navigate={navigate} logo={logo} />
      <div className="main-content full-height">
        <header className="navbar">
          <div>
            <FaBars onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ fontSize: '24px', cursor: 'pointer', marginRight: '20px' }} />
            <h1>Laboratorios ABD</h1>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '10px' }} className="full-height">
          <Card title="Valoraciones disponibles" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div className="action-buttons compact" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <Button type="primary" icon={<FaPlus />} onClick={() => openModal()}>
                Nueva Valoración
              </Button>
              <Button type="default" icon={<FaLink />} onClick={() => setIsAsignarModalOpen(true)}>
                Asignar Valoraciones
              </Button>
            </div>
            <Table
              columns={columnsValoraciones}
              dataSource={valoraciones}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              bordered
              className="custom-table"
            />
          </Card>

          <Card title="Productos con Valoraciones" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Table
              columns={columnsProductos}
              dataSource={productosConValoraciones}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              bordered
              className="custom-table"
            />
          </Card>
        </div>

        <Modal
          title="Valoración"
          open={isModalOpen}
          onOk={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          okText="Guardar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="nombre"
              label="Nombre del componente"
              rules={[{ required: true, message: 'Ingrese el nombre del componente' }]}
            >
              <Input placeholder="Ej: Besilato de Atracurio" />
            </Form.Item>

            <Form.Item
              name="rangoMin"
              label="Rango mínimo (%)"
              rules={[{ required: true, message: 'Ingrese el valor mínimo' }]}
            >
              <Input type="number" step="0.01" placeholder="Ej: 0.90" />
            </Form.Item>

            <Form.Item
              name="rangoMax"
              label="Rango máximo (%)"
              rules={[{ required: true, message: 'Ingrese el valor máximo' }]}
            >
              <Input type="number" step="0.01" placeholder="Ej: 1.15" />
            </Form.Item>
          </Form>

        </Modal>

        <Modal
          title="Asignar Valoraciones a Producto"
          open={isAsignarModalOpen}
          onOk={handleAsignar}
          onCancel={() => {
            setIsAsignarModalOpen(false);
            asignarForm.resetFields();
          }}
          okText="Asignar"
          cancelText="Cancelar"
        >
          <Form form={asignarForm} layout="vertical">
            <Form.Item
              name="productoId"
              label="Producto"
              rules={[{ required: true, message: 'Selecciona un producto' }]}
            >
              <Select
                showSearch
                placeholder="Selecciona un producto"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {productos.map((p) => (
                  <Select.Option key={p.id} value={p.id}>
                    {p.nombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="valoracionIds"
              label="Valoraciones"
              rules={[{ required: true, message: 'Selecciona al menos una valoración' }]}
            >
              <Select
                mode="multiple"
                placeholder="Selecciona valoraciones"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {valoraciones.map((v) => (
                  <Select.Option key={v.id} value={v.id}>
                    {`${v.nombre} (${v.rango})`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>


          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Valoraciones;
