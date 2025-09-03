import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { showSuccessToast, showErrorToast } from '../../utils/toast'
import * as authApi from '../../api/auth'
import useAuth from '../../store/authStore'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type Form = z.infer<typeof schema>

export default function Login() {
  const { register, handleSubmit, formState } = useForm<Form>({ resolver: zodResolver(schema) })
  const setAuth = useAuth((s) => s.setAuth)
  const navigate = useNavigate()

  async function onSubmit(data: Form) {
    try {
      const res = await authApi.login(data)
      const { token, user } = res.data
      setAuth(token, user)
      showSuccessToast(`Welcome back, ${user.hospitalName}!`, { autoClose: 3000 })
      navigate('/app')
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed'
      showErrorToast(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400">Sign in to your CareKeep account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input 
                {...register('email')} 
                className="input-minimal w-full"
                placeholder="Enter your email"
              />
              {formState.errors.email && (
                <div className="text-xs text-red-400 mt-2 flex items-center">
                  {formState.errors.email.message}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input 
                type="password" 
                {...register('password')} 
                className="input-minimal w-full"
                placeholder="Enter your password"
              />
              {formState.errors.password && (
                <div className="text-xs text-red-400 mt-2 flex items-center">
                  {formState.errors.password.message}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={formState.isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {formState.isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6">
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
