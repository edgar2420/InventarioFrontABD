import axios from "axios";

const API_URL = "https://subidaapi.onrender.com/forma-farmaceutica";

// Obtener todas las formas farmacéuticas
export const obtenerFormasFarmaceuticas = async () => {
  try {
    const response = await axios.get(`${API_URL}/obtener`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener formas farmacéuticas:", error);
    throw error;
  }
};

// Crear nueva forma farmacéutica
export const crearFormaFarmaceutica = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, data);
    return response.data;
  } catch (error) {
    console.error("Error al crear forma farmacéutica:", error);
    throw error;
  }
};

// Editar forma farmacéutica existente
export const editarFormaFarmaceutica = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/editar/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al editar forma farmacéutica:", error);
    throw error;
  }
};

// Eliminar forma farmacéutica
export const eliminarFormaFarmaceutica = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar forma farmacéutica:", error);
    throw error;
  }
};
