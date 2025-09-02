import client from './client'

export const login = (payload: { email: string; password: string }) =>
  client.post('/auth/login', payload)

export const register = (payload: { name: string; email: string; password: string }) =>
  client.post('/auth/register', payload)
