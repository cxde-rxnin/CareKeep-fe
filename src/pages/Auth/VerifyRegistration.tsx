import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { showSuccessToast, showErrorToast } from '../../utils/toast'
import useAuth from '../../store/authStore'
import * as authApi from '../../api/auth'

export default function VerifyRegistration() {
  const location = useLocation()
  const navigate = useNavigate()
  const setAuth = useAuth((s) => s.setAuth)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const { sessionId, email } = location.state || {}
  
  useEffect(() => {
    if (!sessionId || !email) {
      navigate('/signup')
    }
  }, [sessionId, email, navigate])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single character
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await authApi.verifyRegistration({ sessionId, otp: otpValue })
      const { user, token } = response.data
      
      // Automatically log the user in after successful registration
      setAuth(token, user)
      
      showSuccessToast(`Welcome to CareKeep, ${user.hospitalName}!`, { autoClose: 3000 })
      setMessage('Registration completed successfully! Redirecting...')
      
      setTimeout(() => navigate('/app'), 2000)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Verification failed'
      showErrorToast(errorMessage)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = async () => {
    setError('')
    setMessage('')
    setIsResending(true)
    
    try {
      await authApi.resendRegistrationOTP({ sessionId })
      showSuccessToast('New verification code sent to your email!', { autoClose: 4000 })
      setMessage('New verification code sent to your email!')
      setOtp(['', '', '', '', '', '']) // Clear OTP inputs
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to resend verification code'
      showErrorToast(errorMessage)
      setError(errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-1">
              Verify Your Email
            </h2>
            <p className="text-gray-400 text-sm mb-1">
              We've sent a 6-digit code to
            </p>
            <p className="text-emerald-400 font-medium text-sm">{email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleBackspace(index, e)}
                  className="w-10 h-10 text-center text-lg font-bold bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                  autoComplete="off"
                />
              ))}
            </div>

            {error && (
              <div className="text-center text-red-400 text-xs">
                {error}
              </div>
            )}

            {message && (
              <div className="text-center text-emerald-400 text-xs">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'Verifying...' : 'Complete Registration'}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors disabled:opacity-50 text-xs"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-4 pt-4">
            <p className="text-center text-xs text-gray-400">
              Remember your details?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
