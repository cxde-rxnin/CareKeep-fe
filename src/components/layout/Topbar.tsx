import { Menu } from 'lucide-react'
import useAuth from '../../store/authStore'

interface TopbarProps {
  onMenuClick?: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const user = useAuth((s) => s.user)
  
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-800">
      <div className="flex items-center gap-4">
        {/* Mobile hamburger menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-gray-400">Manage your secure healthcare backups</p>
        </div>
      </div>
    </div>
  )
}
