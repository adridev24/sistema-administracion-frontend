import axios from 'axios';

// Usa la variable de entorno Vite `VITE_API_URL` o fallback local
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api/auth';

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    });
    
    // Si la API responde con éxito, devolverá el token JWT en response.data
    console.log('Respuesta de la API:', response.data);
    
    // Guardamos el token en localStorage si viene en la respuesta (opcional)
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    // Como ingenieros de software, aquí deberíamos validar la estructura
    // de la respuesta antes de confiar en ella.

    return response.data; // Usualmente: { token: 'ey...', username: '...' }

  } catch (error) {
    // Manejo profesional de errores
    console.error('Error durante el login:', error.response ? error.response.data : error.message);
    throw error; // Re-lanzamos el error para que el componente UI pueda mostrarlo
  }
};

const authService = {
  login
};

export default authService;