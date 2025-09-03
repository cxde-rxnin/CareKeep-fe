import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { showSuccessToast, showErrorToast } from '../../utils/toast'
import * as authApi from '../../api/auth'

const schema = z.object({
  hospitalName: z.string().min(2, "Hospital name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type Form = z.infer<typeof schema>

const steps = [
  { title: 'Hospital Information', description: 'Basic hospital details' },
  { title: 'Contact Details', description: 'Address and phone number' },
  { title: 'Account Security', description: 'Email and password' }
]

export default function Signup() {
  const { register, handleSubmit, formState, trigger } = useForm<Form>({ 
    resolver: zodResolver(schema),
    mode: 'onChange'
  })
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = async () => {
    let fieldsToValidate: (keyof Form)[] = []
    
    if (currentStep === 0) {
      fieldsToValidate = ['hospitalName']
    } else if (currentStep === 1) {
      fieldsToValidate = ['address', 'phoneNumber']
    } else if (currentStep === 2) {
      fieldsToValidate = ['email', 'password', 'confirmPassword']
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  async function onSubmit(data: Form) {
    try {
      const { confirmPassword, ...submitData } = data
      const response = await authApi.initiateRegistration(submitData)
      showSuccessToast('Verification code sent to your email!')
      // Navigate to OTP verification page with sessionId
      navigate('/verify-registration', { state: { sessionId: response.data.sessionId, email: data.email } })
    } catch (err: any) {
      showErrorToast(err.response?.data?.error || 'Registration failed. Please try again.')
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
              Register Hospital
            </h2>
            <p className="text-gray-400 text-sm">Create your hospital's secure backup account</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              {steps.map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors ${
                    index <= currentStep 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-[10px] mt-1 ${
                    index <= currentStep ? 'text-emerald-400' : 'text-gray-500'
                  }`}>
                    Step {index + 1}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Info */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white mb-0.5">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-400 text-xs">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Step 1: Hospital Information */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Hospital Name</label>
                  <input {...register('hospitalName')} className="input-minimal w-full py-2 text-sm" placeholder="Enter hospital name" />
                  {formState.errors.hospitalName && (
                    <div className="text-xs text-red-400 mt-1">
                      {formState.errors.hospitalName.message}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Address</label>
                  <textarea 
                    {...register('address')} 
                    className="input-minimal w-full min-h-[60px] resize-none py-2 text-sm" 
                    placeholder="Enter hospital address"
                    rows={2}
                  />
                  {formState.errors.address && (
                    <div className="text-xs text-red-400 mt-1">
                      {formState.errors.address.message}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number</label>
                  <input {...register('phoneNumber')} className="input-minimal w-full py-2 text-sm" placeholder="Enter hospital phone number" />
                  {formState.errors.phoneNumber && (
                    <div className="text-xs text-red-400 mt-1">
                      {formState.errors.phoneNumber.message}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Account Security */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                  <input {...register('email')} className="input-minimal w-full py-2 text-sm" placeholder="Enter hospital email" />
                  {formState.errors.email && (
                    <div className="text-xs text-red-400 mt-1">
                      {formState.errors.email.message}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                  <input 
                    type="password" 
                    {...register('password')} 
                    className="input-minimal w-full py-2 text-sm"
                    placeholder="Create a strong password (min. 6 characters)"
                  />
                  {formState.errors.password && (
                    <div className="text-xs text-red-400 mt-1">
                      {formState.errors.password.message}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Confirm Password</label>
                  <input 
                    type="password" 
                    {...register('confirmPassword')} 
                    className="input-minimal w-full py-2 text-sm"
                    placeholder="Confirm your password"
                  />
                  {formState.errors.confirmPassword && (
                    <div className="text-xs text-red-400 mt-1">
                      {formState.errors.confirmPassword.message}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-3 mt-6">
              {currentStep > 0 && (
                <button 
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium text-white text-sm transition-all duration-300"
                >
                  Previous
                </button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <button 
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
                >
                  Next Step
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={formState.isSubmitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {formState.isSubmitting ? 'Creating Account...' : 'Register Hospital'}
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="mt-4 pt-4">
            <p className="text-center text-xs text-gray-400">
              Already have an account?{' '}
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
