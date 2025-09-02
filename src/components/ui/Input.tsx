import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  variant?: 'minimal' | 'default'
}

export default function Input({ label, error, variant = 'default', className = '', ...props }: InputProps) {
  const inputClasses = variant === 'minimal' 
    ? `w-full bg-transparent border-none border-b rounded-none px-0 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors duration-200 ${error ? 'border-red-500' : 'border-gray-600'} ${className}`
    : `w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input {...props} className={inputClasses.trim()} />
      {error && (
        <div className="text-xs text-red-400 mt-2 flex items-center">
          {error}
        </div>
      )}
    </div>
  )
}
