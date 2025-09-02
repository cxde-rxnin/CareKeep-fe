import client from './client'

export const listPatients = () => client.get('/patients')
export const getPatient = (id: string) => client.get(`/patients/${id}`)
export const createPatient = (payload: any) => client.post('/patients', payload)
export const updatePatient = (id: string, payload: any) => client.patch(`/patients/${id}`, payload)
export const deletePatient = (id: string) => client.delete(`/patients/${id}`)
