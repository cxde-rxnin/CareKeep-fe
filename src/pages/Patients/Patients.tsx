import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Search } from 'lucide-react'
import { listPatients, createPatient } from '../../api/patients'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

// New multi-step schema (exclude age + status)
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

export default function Patients() {
  const [items, setItems] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { register, handleSubmit, formState, reset, trigger } = useForm<Form>({ resolver: zodResolver(schema), mode: 'onTouched' })
  const [step, setStep] = useState(1)

  useEffect(() => { fetch() }, [])

  const fetch = async () => {
    try { const r = await listPatients(); setItems(r.data) } catch (err) { console.error(err) }
  }

  const next = async () => {
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
      await createPatient(payload)
      setShowModal(false)
      reset()
      setStep(1)
      fetch()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create patient')
    }
  }

  const progress = (step / 3) * 100

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-white">Patients</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              className="w-full sm:w-auto pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="Search patients..."
            />
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Patient</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 lg:gap-4">
        {items.filter(it => it.name.toLowerCase().includes(q.toLowerCase())).map((p) => (
          <Link 
            to={`/app/patients/${p._id}`} 
            key={p._id} 
            className="block bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-[1.02]"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-base lg:text-lg font-semibold text-white mb-1 truncate">{p.name}</div>
                <div className="text-xs lg:text-sm text-gray-400 flex flex-col sm:flex-row gap-1 sm:gap-2">
                  <span>DOB: {p.dob ? new Date(p.dob).toLocaleDateString() : '—'}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Gender: {p.gender || '—'}</span>
                </div>
              </div>
              <div className="text-gray-500 text-xs bg-gray-800/50 px-2 py-1 rounded self-start sm:self-center">
                #{p._id.substring(0, 8)}
              </div>
            </div>
          </Link>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 lg:py-12 text-gray-400">
            <div className="text-3xl lg:text-4xl mb-4">👥</div>
            <p className="text-sm lg:text-base px-4">No patients found. Create your first patient to get started.</p>
          </div>
        )}
      </div>

      {/* Multi-step Create Patient Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setStep(1); }} title="Create New Patient">
        <div className="mb-4">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span className={step >= 1 ? 'text-emerald-400' : ''}>Basic</span>
            <span className={step >= 2 ? 'text-emerald-400' : ''}>Demographics</span>
            <span className={step === 3 ? 'text-emerald-400' : ''}>Admission</span>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <Input label="Patient Name *" placeholder="Full name" {...register('name')} error={formState.errors.name?.message} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Room Number" placeholder="e.g. 12B" {...register('roomNumber')} />
                <Input label="Folder Type" placeholder="e.g. Inpatient" {...register('folderType')} />
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
                <Input label="Date of Birth *" type="date" {...register('dateOfBirth')} error={formState.errors.dateOfBirth?.message} />
                <Input label="Address" placeholder="Address" {...register('address')} />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Date Admitted *" type="date" {...register('dateAdmitted')} error={formState.errors.dateAdmitted?.message} />
                <Input label="Time Admitted *" type="time" {...register('timeAdmitted')} error={formState.errors.timeAdmitted?.message} />
              </div>
              <Input label="Emergency Contact Name *" placeholder="Full name" {...register('emergencyContactName')} error={formState.errors.emergencyContactName?.message} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Emergency Contact Number *" placeholder="Phone" {...register('emergencyContactNumber')} error={formState.errors.emergencyContactNumber?.message} />
                <Input label="Emergency Contact Address" placeholder="Address" {...register('emergencyContactAddress')} />
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {step > 1 && <Button type="button" variant="secondary" onClick={prev} className="w-full sm:w-auto">Back</Button>}
            {step < 3 && <Button type="button" onClick={next} className="w-full sm:w-auto">Next</Button>}
            {step === 3 && <Button type="submit" disabled={formState.isSubmitting} className="w-full sm:w-auto">{formState.isSubmitting ? 'Creating...' : 'Create Patient'}</Button>}
          </div>
        </form>
      </Modal>
    </div>
  )
}
