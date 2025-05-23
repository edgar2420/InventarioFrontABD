import axios from 'axios'

const API_BASE = 'https://inverntario-abd.onrender.com/api'

// Obtener Tipo
export const ObtenerTipo = async () => {
  const res = await axios.get(`${API_BASE}/tipo/obtener`)
  return res.data
}

// Crear Tipo
export const crearTipo = async (tipo) => {
  const res = await axios.post(`${API_BASE}/tipo/agregar`, tipo)
  return res.data
}

// Editar Tipo
export const editarTipo = async (id, tipo) => {
  const res = await axios.put(`${API_BASE}/tipo/editar/${id}`, tipo)
  return res.data
}
// Eliminar Tipo
export const eliminarTipo = async (id) => {
  const res = await axios.delete(`${API_BASE}/tipo/eliminar/${id}`)
  return res.data
}