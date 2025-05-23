import axios from "axios";

const API_URL = "https://subidaapi.onrender.com/auth";

export const login = async (nombre, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { nombre, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos del usuario");
    }

    const data = await response.json();
    return data.usuario;
  } catch (error) {
    throw new Error(error.message);
  }
};
