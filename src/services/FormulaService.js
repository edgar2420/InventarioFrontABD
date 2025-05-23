import axios from "axios";

const API_URL = "https://subidaapi.onrender.com/formulas";

export const getFormulasPorProducto = async (nombre) => {
    const response = await axios.get(`https://subidaapi.onrender.com/formulas/producto/${encodeURIComponent(nombre)}`);
    return response.data;
  };
  

export const subirExcelFormulas = async (archivo) => {
  const formData = new FormData();
  formData.append("file", archivo);

  const response = await axios.post(`${API_URL}/importar-excel`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
};

export const crearFormula = async (data) => {
    const response = await axios.post("https://subidaapi.onrender.com/formulas/crear", data);
    return response.data;
  };
  
  
  export const actualizarFormula = async (id, data) => {
    const response = await axios.put(`https://subidaapi.onrender.com/formulas/editar/${id}`, data);
    return response.data;
  };
  
  
  export const eliminarFormula = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
  };

  export const getTodasLasFormulas = async (page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}/todas?page=${page}&limit=${limit}`);
    return response.data;
  };
  
  