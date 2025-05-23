import axios from "axios";

const API_URL = "https://subidaapi.onrender.com/productos";

// Obtener todos los productos
export const getProductos = async () => {
  const response = await axios.get(`${API_URL}/obtener`);
  return response.data;
};

// Eliminar producto por ID
export const eliminarProducto = async (id) => {
  return axios.delete(`${API_URL}/eliminar/${id}`);
};

// Editar producto por ID
export const editarProducto = async (id, data) => {
  return axios.put(`${API_URL}/editar/${id}`, data);
};

// Importar productos desde Excel
export const importarProductos = async (archivo) => {
  const formData = new FormData();
  formData.append("archivo", archivo);

  const response = await axios.post(`${API_URL}/importar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Crear producto manualmente
export const importarProductosDesdeFormulario = async (data) => {
  const response = await axios.post(`${API_URL}/agregar`, data);
  return response.data;
};

// Buscar productos por nombre/lote/envase/volumen
export const buscarProductos = async (query) => {
  const response = await axios.get(`${API_URL}/buscar?q=${encodeURIComponent(query)}`);
  return response.data;
};


// Obtener fórmula cuali-cuantitativa y especificaciones por nombre de producto
export const obtenerDetalleProducto = async (nombreProducto) => {
  const response = await axios.get(`${API_URL}/detalle-formula/${encodeURIComponent(nombreProducto)}`);
  return response.data;
};

// Obtener productos por clasificación
export const getProductosPorClasificacion = async (clasificacion) => {
  const res = await axios.get(`${API_URL}/por-clasificacion/${clasificacion}`);
  return res.data;
};