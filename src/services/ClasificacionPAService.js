import axios from "axios";

const API_URL = "https://subidaapi.onrender.com/clasificacion-pa";

const getToken = () => localStorage.getItem("token");

// Obtener todas las clasificaciones
export const obtenerClasificaciones = async () => {
  const response = await axios.get(`${API_URL}/obtener`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

// Crear una nueva clasificación
export const crearClasificacion = async (datos) => {
  const response = await axios.post(`${API_URL}/crear`, datos, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

// Editar una clasificación existente
export const editarClasificacion = async (id, datos) => {
  const response = await axios.put(`${API_URL}/editar/${id}`, datos, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

// Eliminar una clasificación
export const eliminarClasificacion = async (id) => {
  const response = await axios.delete(`${API_URL}/eliminar/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};
