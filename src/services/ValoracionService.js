import axios from "axios";

const API_URL = "https://subidaapi.onrender.com/valoraciones";

// ✅ Obtener todas las valoraciones
export const obtenerValoraciones = async () => {
  const response = await axios.get(API_URL); // GET /valoraciones
  return response.data;
};

// ✅ Obtener valoraciones por producto
export const obtenerValoracionesPorProducto = async (productoId) => {
  const response = await axios.get(`${API_URL}/producto/${productoId}`);
  return response.data;
};

// ✅ Crear una o varias valoraciones
export const crearValoracion = async (data) => {
  const response = await axios.post(`${API_URL}/crear`, Array.isArray(data) ? data : [data]);
  return response.data;
};

// ✅ Asignar valoraciones existentes a un producto
export const asignarValoraciones = async ({ productoId, valoracionIds }) => {
  const response = await axios.post(`${API_URL}/asignar`, { productoId, valoracionIds });
  return response.data;
};

// ✅ Editar una valoración
export const editarValoracion = async (id, data) => {
  const response = await axios.put(`${API_URL}/actualizar/${id}`, data);
  return response.data;
};

// ✅ Eliminar una valoración
export const eliminarValoracion = async (id) => {
  const response = await axios.delete(`${API_URL}/eliminar/${id}`);
  return response.data;
};

// ✅ Obtener todos los productos con sus valoraciones asignadas
export const obtenerProductosConValoraciones = async () => {
  const response = await axios.get(`${API_URL}/productos-con-valoraciones`);
  return response.data;
};
