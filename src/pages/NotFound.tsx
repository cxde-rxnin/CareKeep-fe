import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-emerald-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto">
        <div className="mb-6 lg:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-4 lg:mb-6">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-3 lg:mb-4">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Page Not Found</h2>
          <p className="text-sm sm:text-base text-gray-400 mb-6 lg:mb-8 leading-relaxed px-4 sm:px-0">
            The page you're looking for doesn't exist or may have been moved. 
            Let's get you back to safety.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-xs sm:text-sm text-gray-500">
            <span>or </span>
            <Link to="/app" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
