import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function loginRequest(correo, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      correo,
      password,
    })
    return response.data
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Error al iniciar sesión'
    throw new Error(errorMsg)
  }
}
