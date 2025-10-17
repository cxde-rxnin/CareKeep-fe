import { useEffect, useState } from 'react'
import { Users, Database, Shield, Activity, TrendingUp, Clock } from 'lucide-react'
import client from '../api/client'
import socketService from '../services/socket'
import useAuth from '../store/authStore'

interface MetricsResponse {
  metrics: {
    patients: number
    backups: number
    lastBackup: string | null
    backupStatusMap: { completed: number; failed: number; running: number }
  }
  health: { api: string; backups: string; security: string }
  activity: { type: string; status?: string; at: string; message: string }[]
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<{ patients: number; backups: number; lastBackup: string; backupStatusMap?: any }>({ patients: 0, backups: 0, lastBackup: '—' })
  const [health, setHealth] = useState<{ api: string; backups: string; security: string } | null>(null)
  const [activity, setActivity] = useState<MetricsResponse['activity']>([])
  const [loading, setLoading] = useState(true)
  const token = useAuth(s => s.token)

  const loadMetrics = async () => {
    try {
      setLoading(true)
      const res = await client.get<MetricsResponse>('/metrics')
      const { metrics: m, health: h, activity: a } = res.data
      setMetrics({
        patients: m.patients,
        backups: m.backups,
        lastBackup: m.lastBackup ? new Date(m.lastBackup).toLocaleString() : '—',
        backupStatusMap: m.backupStatusMap
      })
      setHealth(h)
      setActivity(a)
    } catch {
      // fallback to previous static approach
      try {
        const p = await client.get('/patients')
        const b = await client.get('/backups')
        setMetrics({
          patients: p.data?.length ?? 0,
          backups: b.data?.length ?? 0,
          lastBackup: b.data?.[0]?.backupDate ? new Date(b.data[0].backupDate).toLocaleString() : '—'
        })
      } catch {}
    } finally { setLoading(false) }
  }

  useEffect(() => {
    loadMetrics()
    
    // Setup WebSocket connection for real-time updates, passing token
    socketService.connect(token || undefined)
    
    const handleActivityUpdate = (newActivity: any) => {
      console.log('📡 New activity:', newActivity)
      setActivity(prev => {
        const updated = [newActivity, ...prev].slice(0, 10) // Keep only latest 10
        return updated
      })
      // Optionally refresh full metrics periodically or on specific events
      if (newActivity.type === 'patient') {
        setMetrics(prev => ({ ...prev, patients: prev.patients + 1 }))
      }
    }
    
    socketService.on('activity_update', handleActivityUpdate)
    
    return () => {
      socketService.off('activity_update', handleActivityUpdate)
      socketService.disconnect()
    }
  }, [token])

  const healthItem = (_valueLabel: string, value?: string) => {
    const status = value || 'unknown'
    let color = 'text-gray-400'
    if (status === 'healthy' || status === 'operational' || status === 'secure') color = 'text-emerald-400'
    if (status === 'degraded') color = 'text-yellow-400'
    if (status === 'down' || status === 'failed') color = 'text-red-400'
    return <span className={`text-xs lg:text-sm ${color}`}>{status.charAt(0).toUpperCase()+status.slice(1)}</span>
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 lg:p-6 hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs lg:text-sm font-medium text-gray-400 mb-1">Total Patients</h3>
              <div className="text-2xl lg:text-3xl font-bold text-white">{metrics.patients}</div>
              <div className="text-xs text-emerald-400 mt-1">{!loading && metrics.patients === 0 ? 'No patients yet' : '+2.5% from last month'}</div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 lg:p-6 hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs lg:text-sm font-medium text-gray-400 mb-1">Backups Created</h3>
              <div className="text-2xl lg:text-3xl font-bold text-white">{metrics.backups}</div>
              <div className="text-xs text-emerald-400 mt-1">{metrics.backupStatusMap ? `${metrics.backupStatusMap.completed} completed` : 'All successful'}</div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 lg:p-6 hover:border-emerald-500/30 transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs lg:text-sm font-medium text-gray-400 mb-1">Last Backup</h3>
              <div className="text-lg lg:text-xl font-bold text-white">{metrics.lastBackup}</div>
              <div className="text-xs text-emerald-400 mt-1">{metrics.backupStatusMap?.running ? 'In Progress' : 'Automated'}</div>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* System Health */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 lg:p-6 h-60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-white">System Health</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${health?.backups === 'degraded' ? 'bg-yellow-400' : 'bg-emerald-400'}`}></div>
              <span className={`text-xs lg:text-sm ${health?.backups === 'degraded' ? 'text-yellow-400' : 'text-emerald-400'}`}>{health ? (health.backups === 'degraded' ? 'Attention Needed' : 'All Systems Operational') : 'Loading...'}</span>
            </div>
          </div>
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                <span className="text-sm lg:text-base text-gray-300">Security Status</span>
              </div>
              {healthItem('Security', health?.security)}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                <span className="text-sm lg:text-base text-gray-300">Backup Service</span>
              </div>
              {healthItem('Backups', health?.backups)}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                <span className="text-sm lg:text-base text-gray-300">API Status</span>
              </div>
              {healthItem('API', health?.api)}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 lg:p-6 h-60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-white">Recent Activity</h3>
            <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
          </div>
          <div className="h-40 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {loading && <div className="text-xs text-gray-400">Loading...</div>}
            {!loading && activity.length === 0 && <div className="text-xs text-gray-400 py-8 text-center">No recent activity yet.</div>}
            {activity.map((a, i) => {
              const color = a.type === 'backup' ? (a.status === 'failed' ? 'bg-red-400' : a.status === 'running' ? 'bg-yellow-400' : 'bg-emerald-400')
                : a.type === 'patient' ? 'bg-blue-400' : 'bg-purple-400'
              return (
                <div key={`${a.at}-${i}`} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className={`w-2 h-2 ${color} rounded-full flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs lg:text-sm text-white truncate">{a.message}</div>
                    <div className="text-xs text-gray-400">{new Date(a.at).toLocaleString()}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          <button className="p-3 lg:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all duration-200 text-left">
            <Users className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400 mb-2" />
            <div className="text-sm lg:text-base text-white font-medium">Add Patient</div>
            <div className="text-xs lg:text-sm text-gray-400">Create new patient record</div>
          </button>
          <button className="p-3 lg:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all duration-200 text-left">
            <Database className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400 mb-2" />
            <div className="text-sm lg:text-base text-white font-medium">Create Backup</div>
            <div className="text-xs lg:text-sm text-gray-400">Start manual backup</div>
          </button>
          <button className="p-3 lg:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all duration-200 text-left md:col-span-2 lg:col-span-1">
            <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400 mb-2" />
            <div className="text-sm lg:text-base text-white font-medium">Security Report</div>
            <div className="text-xs lg:text-sm text-gray-400">View compliance status</div>
          </button>
        </div>
      </div>
    </div>
  )
}
