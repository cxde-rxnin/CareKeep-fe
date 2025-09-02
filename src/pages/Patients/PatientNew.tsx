import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { createPatient } from '../../api/patients'
import { ArrowLeft, User } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Gender is required' }),
  medicalHistory: z.string().optional()
})

type Form = z.infer<typeof schema>

export default function PatientNew() {
  const { register, handleSubmit, formState } = useForm<Form>({ resolver: zodResolver(schema) })
  const navigate = useNavigate()

  async function onSubmit(data: Form) {
    try {
      // Calculate age from date of birth
      const age = data.dob ? calculateAge(data.dob) : undefined
      
      const payload = { 
        name: data.name,
        age: age,
        dob: data.dob,
        gender: data.gender,
        medicalHistory: data.medicalHistory ? [data.medicalHistory] : [] 
      }
      const res = await createPatient(payload)
      navigate(`/app/patients/${res.data._id}`)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed')
    }
  }

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date()
    const dob = new Date(dateOfBirth)
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    
    return age
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={() => navigate('/app/patients')}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm lg:text-base">Back to Patients</span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 lg:p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-white">New Patient</h2>
            <p className="text-xs lg:text-sm text-gray-400">Add a new patient to the system</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <Input
              placeholder="Enter patient's full name"
              {...register('name')}
              error={formState.errors.name?.message}
            />
            {formState.errors.name && (
              <div className="text-xs text-red-400 mt-1">{formState.errors.name.message}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date of Birth <span className="text-red-400">*</span>
            </label>
            <Input
              type="date"
              {...register('dob')}
              error={formState.errors.dob?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender <span className="text-red-400">*</span>
            </label>
            <select
              {...register('gender')}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all text-sm lg:text-base"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formState.errors.gender && (
              <div className="text-xs text-red-400 mt-1">{formState.errors.gender.message}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Medical Notes
            </label>
            <textarea
              placeholder="Enter any relevant medical history or notes"
              {...register('medicalHistory')}
              rows={4}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all resize-none text-sm lg:text-base"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/app/patients')}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full sm:w-auto"
            >
              {formState.isSubmitting ? 'Creating...' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
