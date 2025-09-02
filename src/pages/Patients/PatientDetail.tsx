import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPatient, updatePatient } from '../../api/patients'
import FileUpload from '../../components/ui/FileUpload'

export default function PatientDetail() {
  const { id } = useParams()
  const [p, setP] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => { if (id) fetchPatient() }, [id])

  const fetchPatient = async () => {
    try {
      const r = await getPatient(id!)
      setP(r.data)
      setName(r.data.name)
      setNotes((r.data.medicalHistory || []).join(', '))
    } catch (err) { console.error(err) }
  }

  const save = async () => {
    setSaving(true)
    try {
      await updatePatient(id!, { name, medicalHistory: notes ? notes.split(',').map(s => s.trim()) : [] })
      setEditing(false)
      fetchPatient()
    } catch (err) { 
      alert('Failed') 
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (file: File) => {
    // assumes your backend accepts multipart /documents endpoint (not in this scaffold)
    const form = new FormData()
    form.append('patientId', id!)
    form.append('file', file)
    try {
      await fetch(import.meta.env.VITE_API_BASE + '/documents/upload', { method: 'POST', body: form })
      alert('Uploaded')
      fetchPatient()
    } catch {
      alert('Upload failed')
    }
  }

  if (!p) return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl lg:rounded-2xl p-4 lg:p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Patient Info Card */}
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl lg:rounded-2xl p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">{p.name}</h3>
            <div className="space-y-1 text-sm lg:text-base">
              <div className="text-gray-400">
                DOB: {p.dob ? new Date(p.dob).toLocaleDateString() : '—'}
              </div>
              <div className="text-gray-400">
                Gender: {p.gender || '—'}
              </div>
            </div>
            <div className="mt-3 text-xs lg:text-sm text-gray-300">
              <span className="text-gray-400 font-medium">Medical History:</span>
              <div className="mt-1">
                {(p.medicalHistory || []).length > 0 
                  ? (p.medicalHistory || []).join(', ')
                  : 'No medical history recorded'
                }
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setEditing(!editing)} 
              className="px-3 py-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-white rounded-lg transition-colors"
            >
              {editing ? 'Cancel Edit' : 'Edit'}
            </button>
          </div>
        </div>

        {editing && (
          <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input 
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Patient name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Medical History</label>
              <textarea 
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter medical notes separated by commas"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={save}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={() => setEditing(false)} 
                className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600 text-white font-medium rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents Card */}
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl lg:rounded-2xl p-4 lg:p-6">
        <h4 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">Documents</h4>
        
        <div className="space-y-3 mb-4 lg:mb-6">
          {p.documents?.length ? (
            p.documents.map((d: any) => (
              <div key={d._id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="min-w-0 flex-1">
                  <div className="text-sm lg:text-base text-white truncate">{d.fileName}</div>
                  <div className="text-xs text-gray-400">
                    Uploaded {new Date(d.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <a 
                  href={d.fileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="ml-3 px-3 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  View
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm">No documents uploaded yet</p>
            </div>
          )}
        </div>

        <FileUpload onUpload={handleUpload} />
      </div>
    </div>
  )
}
