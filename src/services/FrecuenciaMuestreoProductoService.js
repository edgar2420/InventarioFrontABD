import axios from "axios";

const API_URL = "https://subidaapi.onrender.com/frecuencia-producto";

// Obtener todas las frecuencias guardadas
export const obtenerTodasFrecuencias = async () => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};

// ✅ CORREGIDO: Obtener frecuencias por producto y tipo de estudio
export const obtenerFrecuenciaPorProductoYTipo = async (productoId, tipoEstudio) => {
  const res = await axios.get(`${API_URL}/producto/${productoId}/tipo/${encodeURIComponent(tipoEstudio)}`);
  return res.data;
};

// Crear una nueva frecuencia
export const crearFrecuencia = async (nuevaFrecuencia) => {
  const res = await axios.post(`${API_URL}`, nuevaFrecuencia);
  return res.data;
};

// Editar una frecuencia existente
export const editarFrecuencia = async (id, datosActualizados) => {
  const res = await axios.put(`${API_URL}/${id}`, datosActualizados);
  return res.data;
};

// Eliminar una frecuencia
export const eliminarFrecuencia = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
