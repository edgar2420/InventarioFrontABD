import axios from 'axios'

const API_BASE = 'https://inverntario-abd.onrender.com/api'

// Registrar un nuevo movimiento
export const registrarMovimiento = async (datos) => {
  const res = await axios.post(`${API_BASE}/movimiento/crear`, datos)
  return res.data
}

// Obtener todos los componentes disponibles para seleccionar
export const obtenerComponentes = async () => {
  const res = await axios.get(`${API_BASE}/componente`)
  return res.data
}

// Obtener historial de movimientos (opcional)
export const obtenerMovimientos = async () => {
  const res = await axios.get(`${API_BASE}/movimiento`)
  return res.data
}
