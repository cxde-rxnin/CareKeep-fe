import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// Add a request interceptor to include the auth token
client.interceptors.request.use((config) => {
  const authData = localStorage.getItem('carekeep-auth')
  if (authData) {
    try {
      const { state } = JSON.parse(authData)
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    } catch (error) {
      console.error('Error parsing auth data:', error)
    }
  }
  return config
})

// Add a response interceptor to handle 401 errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('carekeep-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
