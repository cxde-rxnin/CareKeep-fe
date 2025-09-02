import { NavLink } from 'react-router-dom'
import { Users, Database, FileText, Shield, User, LogOut, X } from 'lucide-react'
import useAuth from '../../store/authStore'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const clearAuth = useAuth((s) => s.clearAuth)
  const user = useAuth((s) => s.user)

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-72 bg-gray-900/50 border-r border-gray-800 backdrop-blur-sm flex flex-col z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 flex-1 flex flex-col">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              CareKeep
            </span>
          </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavLink 
            to="/app" 
            end 
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-300' 
                  : 'hover:bg-gray-800/50 text-gray-300 hover:text-emerald-300'
              }`
            }
          >
            <Database className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </NavLink>

          <NavLink 
            to="/app/patients" 
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-300' 
                  : 'hover:bg-gray-800/50 text-gray-300 hover:text-emerald-300'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Patients</span>
          </NavLink>

          <NavLink 
            to="/app/backups" 
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-300' 
                  : 'hover:bg-gray-800/50 text-gray-300 hover:text-emerald-300'
              }`
            }
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Backups</span>
          </NavLink>
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white font-medium truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          
          <button 
            onClick={clearAuth}
            className="w-full flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  )
}
