import { useEffect, useState } from 'react'
import { Database, Play, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react'
import { listBackups, runBackup, downloadBackup } from '../api/backups'
import Button from '../components/ui/Button'

export default function Backups() {
  const [items, setItems] = useState<any[]>([])
  const [busy, setBusy] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => { fetch() }, [])

  async function fetch() {
    try {
      const r = await listBackups()
      setItems(r.data)
    } catch { /* ignore */ }
  }

  async function trigger() {
    setBusy(true)
    try {
      await runBackup()
      alert('Backup started')
      fetch()
    } catch {
      alert('Failed to start backup')
    } finally {
      setBusy(false)
    }
  }

  async function handleDownload(backupId: string, filename: string) {
    setDownloading(backupId)
    try {
      const response = await downloadBackup(backupId)
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to download backup')
    } finally {
      setDownloading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'running': case 'in-progress': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'failed': case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />
      default: return <Database className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/10'
      case 'running': case 'in-progress': return 'text-yellow-400 bg-yellow-500/10'
      case 'failed': case 'error': return 'text-red-400 bg-red-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">Backups</h2>
          <p className="text-sm lg:text-base text-gray-400">Manage and monitor your data backups</p>
        </div>
        <Button 
          onClick={trigger} 
          disabled={busy} 
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Play className="w-4 h-4" />
          {busy ? 'Running Backup...' : 'Run Backup'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg lg:text-xl font-bold text-white">{items.length}</div>
              <div className="text-xs lg:text-sm text-gray-400">Total Backups</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg lg:text-xl font-bold text-white">
                {items.filter(item => item.status?.toLowerCase() === 'completed').length}
              </div>
              <div className="text-xs lg:text-sm text-gray-400">Completed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 lg:p-6 md:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-lg lg:text-xl font-bold text-white">
                {items.length > 0 
                  ? new Date(items[0]?.backupDate ?? items[0]?.createdAt ?? items[0]?.startedAt).toLocaleDateString()
                  : '—'
                }
              </div>
              <div className="text-xs lg:text-sm text-gray-400">Last Backup</div>
            </div>
          </div>
        </div>
      </div>

      {/* Backups List */}
      <div>
        <h3 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">Backup History</h3>
        
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 lg:p-8 text-center">
              <div className="text-3xl lg:text-4xl mb-4">💾</div>
              <h4 className="text-base lg:text-lg font-semibold text-white mb-2">No Backups Yet</h4>
              <p className="text-sm lg:text-base text-gray-400 mb-4">
                Create your first backup to ensure your data is safe and secure.
              </p>
              <Button onClick={trigger} disabled={busy} className="inline-flex items-center gap-2">
                <Play className="w-4 h-4" />
                {busy ? 'Running...' : 'Create First Backup'}
              </Button>
            </div>
          ) : (
            items.map((item, index) => (
              <div 
                key={item._id} 
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 lg:p-6 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getStatusIcon(item.status)}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm lg:text-base font-semibold text-white truncate">
                        {item.snapshotKey || `Backup #${items.length - index}`}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-400">
                        {new Date(item.backupDate ?? item.createdAt ?? item.startedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between lg:justify-end gap-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status || 'Unknown'}
                    </span>
                    {item.status?.toLowerCase() === 'completed' && (
                      <button 
                        onClick={() => handleDownload(item._id, item.snapshotKey)}
                        disabled={downloading === item._id}
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs lg:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-3 h-3" />
                        {downloading === item._id ? 'Downloading...' : 'Download'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
