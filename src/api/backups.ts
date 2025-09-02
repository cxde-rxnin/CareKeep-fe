import client from './client'

export const listBackups = () => client.get('/backups')
export const runBackup = (scope: string = 'full') => client.post('/backups', { scope })
export const downloadBackup = async (backupId: string) => {
  const response = await client.get(`/backups/${backupId}/download`, {
    responseType: 'blob'
  })
  return response
}
