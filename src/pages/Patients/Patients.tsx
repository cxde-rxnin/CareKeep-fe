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

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Gender is required' }),
  medicalHistory: z.string().optional()
})

type Form = z.infer<typeof schema>

export default function Patients() {
  const [items, setItems] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { register, handleSubmit, formState, reset } = useForm<Form>({ resolver: zodResolver(schema) })

  useEffect(() => { fetch() }, [])

  const fetch = async () => {
    try {
      const r = await listPatients()
      setItems(r.data)
    } catch (err) {
      console.error(err)
    }
  }

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
      await createPatient(payload)
      setShowModal(false)
      reset()
      fetch() // Refresh the list
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create patient')
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

      {/* Create Patient Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create New Patient">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            {...register('name')}
            placeholder="Enter patient's full name"
            error={formState.errors.name?.message}
          />

          <Input
            label="Date of Birth *"
            type="date"
            {...register('dob')}
            error={formState.errors.dob?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender <span className="text-red-400">*</span>
            </label>
            <select 
              {...register('gender')} 
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Medical Notes</label>
            <textarea 
              {...register('medicalHistory')} 
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={3}
              placeholder="Enter medical history or notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? 'Creating...' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
