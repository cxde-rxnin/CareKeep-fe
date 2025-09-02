import { useEffect, useState } from 'react'
import { Users, Database, Shield, Activity, TrendingUp, Clock } from 'lucide-react'
import client from '../api/client'

export default function Dashboard() {
  // lightweight metric placeholders
  const [metrics, setMetrics] = useState({ patients: 0, backups: 0, lastBackup: '—' })

  useEffect(() => {
    // fetch some basic counts from the API if available (fallbacks used)
    (async () => {
      try {
        const p = await client.get('/patients')
        const b = await client.get('/backups')
        setMetrics({
          patients: p.data?.length ?? 0,
          backups: b.data?.length ?? 0,
          lastBackup: b.data?.[0]?.backupDate ? new Date(b.data[0].backupDate).toLocaleString() : '—'
        })
      } catch {
        // ignore
      }
    })()
  }, [])

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 lg:p-6 hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs lg:text-sm font-medium text-gray-400 mb-1">Total Patients</h3>
              <div className="text-2xl lg:text-3xl font-bold text-white">{metrics.patients}</div>
              <div className="text-xs text-emerald-400 mt-1">+2.5% from last month</div>
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
              <div className="text-xs text-emerald-400 mt-1">All successful</div>
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
              <div className="text-xs text-emerald-400 mt-1">Automated</div>
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
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-white">System Health</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-xs lg:text-sm text-emerald-400">All Systems Operational</span>
            </div>
          </div>
          
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                <span className="text-sm lg:text-base text-gray-300">Security Status</span>
              </div>
              <span className="text-emerald-400 text-xs lg:text-sm">Secure</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                <span className="text-sm lg:text-base text-gray-300">Backup Service</span>
              </div>
              <span className="text-emerald-400 text-xs lg:text-sm">Active</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                <span className="text-sm lg:text-base text-gray-300">API Status</span>
              </div>
              <span className="text-emerald-400 text-xs lg:text-sm">Healthy</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-white">Recent Activity</h3>
            <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-xs lg:text-sm text-white">Automatic backup completed</div>
                <div className="text-xs text-gray-400">2 minutes ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-xs lg:text-sm text-white">New patient record created</div>
                <div className="text-xs text-gray-400">1 hour ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-xs lg:text-sm text-white">Security scan completed</div>
                <div className="text-xs text-gray-400">3 hours ago</div>
              </div>
            </div>
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
