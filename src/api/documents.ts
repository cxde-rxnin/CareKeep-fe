import client from './client'

export const uploadDocument = (patientId: string, file: File, customName?: string) => {
  const form = new FormData()
  form.append('patientId', patientId)
  if (customName) form.append('customName', customName)
  form.append('file', file)
  return client.post('/documents/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export const listPatientDocuments = (patientId: string) => client.get(`/documents/patient/${patientId}`)
export const getDocument = (id: string) => client.get(`/documents/${id}`, { responseType: 'blob' })
