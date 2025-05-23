import axios from 'axios';

const API_URL = 'https://subidaapi.onrender.com/especificaciones';

// Obtener todas las especificaciones
export const getEspecificaciones = async () => {
    try {
        const response = await axios.get(`${API_URL}/obtener`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las especificaciones:', error);
        throw error;
    }
};

// Crear nueva especificación
export const crearEspecificacion = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/crear`, data);
        return response.data;
    } catch (error) {
        console.error("Error al crear la especificación:", error);
        throw error;
    }
};

// Editar especificación
export const editarEspecificacion = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/editar/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error al editar la especificación:", error);
        throw error;
    }
};

// Eliminar especificación
export const eliminarEspecificacion = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/eliminar/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la especificación:", error);
        throw error;
    }
};

// Obtener especificaciones por nombre de producto
export const obtenerEspecificacionesPorProducto = async (nombreProducto) => {
    const res = await axios.get(`${API_URL}/producto/${encodeURIComponent(nombreProducto)}`);
    return res.data;
};
