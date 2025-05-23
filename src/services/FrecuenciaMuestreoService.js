import axios from "axios";

const API_URL = "https://subidaapi.onrender.com/frecuencia";

export const obtenerFrecuenciaPorProductoYTipo = async (producto, tipoEstudio) => {
  try {
    const res = await axios.get(
      `${API_URL}/producto/${encodeURIComponent(producto)}/tipo/${encodeURIComponent(tipoEstudio)}`
    );
    return res.data.frecuencias;
  } catch (error) {
    console.error("❌ Error al obtener frecuencia:", error);
    throw error;
  }
};
