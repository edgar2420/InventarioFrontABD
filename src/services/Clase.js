import axios from 'axios'

const API_BASE = 'https://inverntario-abd.onrender.com/api'

// Obtener Clase
export const obtenerClases = async () => {
  const res = await axios.get(`${API_BASE}/clase/obtener`)
  return res.data
}

// Crear Clase
export const crearClase = async (clase) => {
  const res = await axios.post(`${API_BASE}/clase/agregar`, clase)
  return res.data
}

// Editar Clase
export const editarClase = async (id, clase) => {
  const res = await axios.put(`${API_BASE}/clase/editar/${id}`, clase)
  return res.data
}
// Eliminar Clase
export const eliminarClase = async (id) => {
  const res = await axios.delete(`${API_BASE}/clase/eliminar/${id}`)
  return res.data
}