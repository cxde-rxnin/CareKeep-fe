import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { createPatient } from '../../api/patients'
import { ArrowLeft, User } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useState } from 'react'

// Steps: 1) Basic (name, roomNumber, folderType) 2) Demographics (gender, dateOfBirth, address) 3) Admission (dateAdmitted, timeAdmitted, emergency contact details)

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  roomNumber: z.string().optional(),
  folderType: z.string().optional(),
  gender: z.enum(['male', 'female', 'other'], { message: 'Gender is required' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().optional(),
  dateAdmitted: z.string().min(1, 'Date admitted is required'),
  timeAdmitted: z.string().min(1, 'Time admitted is required'),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactNumber: z.string().min(1, 'Emergency contact number is required'),
  emergencyContactAddress: z.string().optional()
})

type Form = z.infer<typeof schema>

export default function PatientNew() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState, trigger } = useForm<Form>({ resolver: zodResolver(schema), mode: 'onTouched' })
  const [step, setStep] = useState(1)

  const next = async () => {
    // Validate current step fields
    let fields: (keyof Form)[] = []
    if (step === 1) fields = ['name', 'roomNumber', 'folderType']
    if (step === 2) fields = ['gender', 'dateOfBirth', 'address']
    if (step === 3) fields = ['dateAdmitted', 'timeAdmitted', 'emergencyContactName', 'emergencyContactNumber', 'emergencyContactAddress']
    const valid = await trigger(fields, { shouldFocus: true })
    if (valid && step < 3) setStep(step + 1)
  }

  const prev = () => setStep(s => Math.max(1, s - 1))

  async function onSubmit(data: Form) {
    try {
      // derive age dynamically on server via virtual; just pass dateOfBirth
      const payload = {
        name: data.name,
        roomNumber: data.roomNumber,
        folderType: data.folderType,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        dateAdmitted: data.dateAdmitted,
        timeAdmitted: data.timeAdmitted,
        emergencyContactName: data.emergencyContactName,
        emergencyContactNumber: data.emergencyContactNumber,
        emergencyContactAddress: data.emergencyContactAddress
      }
      const res = await createPatient(payload)
      navigate(`/app/patients/${res.data._id}`)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed')
    }
  }

  const progress = (step / 3) * 100

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
            <p className="text-xs lg:text-sm text-gray-400">Register a new patient</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span className={step >= 1 ? 'text-emerald-400' : ''}>Basic</span>
            <span className={step >= 2 ? 'text-emerald-400' : ''}>Demographics</span>
            <span className={step === 3 ? 'text-emerald-400' : ''}>Admission</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Patient Name *</label>
                <Input placeholder="Full name" {...register('name')} error={formState.errors.name?.message} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Room Number</label>
                  <Input placeholder="e.g. 12B" {...register('roomNumber')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Folder Type</label>
                  <Input placeholder="e.g. Inpatient" {...register('folderType')} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender *</label>
                <select {...register('gender')} className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formState.errors.gender && <p className="text-xs text-red-400 mt-1">{formState.errors.gender.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth *</label>
                  <Input type="date" {...register('dateOfBirth')} error={formState.errors.dateOfBirth?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <Input placeholder="Residential address" {...register('address')} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date Admitted *</label>
                  <Input type="date" {...register('dateAdmitted')} error={formState.errors.dateAdmitted?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time Admitted *</label>
                  <Input type="time" {...register('timeAdmitted')} error={formState.errors.timeAdmitted?.message} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact Name *</label>
                <Input placeholder="Full name" {...register('emergencyContactName')} error={formState.errors.emergencyContactName?.message} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact Number *</label>
                  <Input placeholder="Phone number" {...register('emergencyContactNumber')} error={formState.errors.emergencyContactNumber?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact Address</label>
                  <Input placeholder="Address" {...register('emergencyContactAddress')} />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={prev} className="w-full sm:w-auto">Back</Button>
            )}
            {step < 3 && (
              <Button type="button" onClick={next} className="w-full sm:w-auto">Next</Button>
            )}
            {step === 3 && (
              <Button type="submit" disabled={formState.isSubmitting} className="w-full sm:w-auto">
                {formState.isSubmitting ? 'Creating...' : 'Create Patient'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
