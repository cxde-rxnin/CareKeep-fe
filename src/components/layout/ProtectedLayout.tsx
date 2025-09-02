import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useAuth from '../../store/authStore'

export default function ProtectedLayout() {
  const token = useAuth((s) => s.token)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  if (!token) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <div className="flex-1 lg:ml-72 bg-gradient-to-br from-gray-900/20 to-gray-800/20">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
