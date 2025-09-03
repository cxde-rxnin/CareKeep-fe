import client from './client'

export const login = (payload: { email: string; password: string }) =>
  client.post('/auth/login', payload)

export const initiateRegistration = (payload: { 
  hospitalName: string; 
  email: string; 
  password: string; 
  address: string; 
  phoneNumber: string; 
}) =>
  client.post('/auth/initiate-registration', payload)

export const verifyRegistration = (payload: { sessionId: string; otp: string }) =>
  client.post('/auth/verify-registration', payload)

export const resendRegistrationOTP = (payload: { sessionId: string }) =>
  client.post('/auth/resend-registration-otp', payload)

export const getProfile = () => client.get('/auth/profile')

export const updateProfile = (payload: { hospitalName?: string; email?: string; address?: string; phoneNumber?: string }) =>
  client.put('/auth/profile', payload)
