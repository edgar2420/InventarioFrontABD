import axios from "axios";

const API_URL = "https://subidaapi.onrender.com/protocolo";

// Obtener todos los protocolos
export const obtenerProtocolos = async () => {
  const res = await axios.get(`${API_URL}/obtener`);
  return res.data;
};

// Obtener el próximo código de protocolo
export const obtenerCodigoProtocolo = async () => {
  const res = await axios.get(`${API_URL}/generar-codigo`);
  return res.data; // { codigo: "PROT-001" }
};

// Crear un nuevo protocolo
export const crearProtocolo = async (datos) => {
  const res = await axios.post(`${API_URL}/crear`, datos);
  return res.data;
};

// Obtener un protocolo por ID
export const obtenerProtocoloPorId = async (id) => {
  const res = await axios.get(`${API_URL}/obtener/${id}`);
  return res.data;
};

// Eliminar protocolo
export const eliminarProtocolo = async (id) => {
  const res = await axios.delete(`${API_URL}/eliminar/${id}`);
  return res.data;
};
