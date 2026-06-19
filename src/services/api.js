const API_URL = import.meta.env.VITE_API_URL

export async function loginRequest(correo, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Error al iniciar sesión')
  }

  return data
}
