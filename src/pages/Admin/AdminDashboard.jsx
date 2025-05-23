import React, { useState, useEffect } from 'react';
import { FaUser, FaBars, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import logo from '../../assets/laboratoriosabd.png';
import './AdminDashboard.css';
import { Modal, message } from 'antd';
import { logout } from "../../services/AuthService";
import {
  getProductos,
  eliminarProducto,
  editarProducto,
  buscarProductos,
  importarProductosDesdeFormulario,
} from "../../services/ProductoService";
import ProductoFormModal from './ProductoFormModal';
import ProductoTable from './ProductoTable';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [importLogs] = useState([]);
  const [form] = ProductoFormModal.useForm();
  const navigate = useNavigate();

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch {
      message.error("Error al obtener productos");
    }
  };


  useEffect(() => {
    fetchProductos();
  }, []);

  const openEditModal = (producto = {}) => {
    setProductoEditando(producto);

    form.setFieldsValue({
      ...producto,
      formaFarmaceuticaNombre: producto.formaFarmaceutica?.nombre || "",
      fechaAnalisis: producto.fechaAnalisis ? dayjs(producto.fechaAnalisis) : null,
    });

    setIsEditModalOpen(true);
  };


  const handleUpdateProducto = async () => {
    try {
      const values = await form.validateFields();
      if (values.fechaAnalisis?.format) {
        values.fechaAnalisis = values.fechaAnalisis.format("YYYY-MM-DD");
      }

      if (productoEditando?.id) {
        await editarProducto(productoEditando.id, values);
        message.success("Producto editado exitosamente ✅");
      } else {
        await importarProductosDesdeFormulario(values);
        message.success("Producto creado exitosamente ✅");
      }

      setIsEditModalOpen(false);
      fetchProductos();
    } catch {
      message.error("Error al guardar producto ❌");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar este producto?",
      content: "Esta acción no se puede deshacer.",
      okText: "Sí, eliminar",
      cancelText: "Cancelar",
      okType: "danger",
      centered: true,
      onOk: async () => {
        try {
          await eliminarProducto(id);
          message.success("Producto eliminado exitosamente 🗑️");
          fetchProductos();
        } catch (error) {
          console.error("Error al eliminar producto:", error);
        }
      },
    });
  };

  const handleImport = async (event) => {
    const files = event.target.files;
    if (!files || files.length < 1) {
      message.warning("Debes seleccionar un archivo Excel.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("archivo", files[0]);

      const response = await fetch("http://localhost:3000/productos/importar", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        if (result.logs && result.logs.length > 0) {
          Modal.success({
            title: "Importación completa",
            content: result.logs.join("\n"),
          });
        } else {
          Modal.info({
            title: "Importación completa",
            content: "Archivo procesado correctamente, pero no se devolvieron logs.",
          });
        }
        fetchProductos();
      } else {
        Modal.error({
          title: "Error al importar",
          content: result.msg || "Ocurrió un error durante la importación.",
        });
      }
    } catch (error) {
      console.error("Error al importar productos:", error);
      Modal.error({
        title: "Error al importar",
        content: "Ocurrió un error al procesar el archivo.",
      });
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

          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            sugerencias={sugerencias}
            setSugerencias={setSugerencias}
            buscarProductos={buscarProductos}
            handleSearch={fetchProductos}
            setProductos={setProductos}
          />

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
                        await logout();
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
            <input
              id="import-file"
              type="file"
              onChange={handleImport}
              style={{ display: "none" }}
            />
            <FaPlus
              className="icon-action"
              onClick={() => openEditModal()}
              title="Crear Producto"
            />
          </div>

          <ProductoTable
            productos={productos}
            openEditModal={openEditModal}
            handleDelete={handleDelete}
          />
        </div>

        <ProductoFormModal
          visible={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onOk={handleUpdateProducto}
          form={form}
          isEdit={!!productoEditando}
          productoSeleccionado={productoEditando}
        />


        <Modal
          title="Resultado de Importación"
          open={logModalVisible}
          onCancel={() => setLogModalVisible(false)}
          footer={null}
          width={600}
        >
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {importLogs.map((log, index) => (
              <p key={index} style={{ marginBottom: '8px' }}>- {log}</p>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
