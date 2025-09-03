import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPatient, updatePatient, updatePatientStatus } from '../../api/patients'
import FileUpload from '../../components/ui/FileUpload'
import { uploadDocument } from '../../api/documents'
import { toast } from 'react-toastify'
import Modal from '../../components/ui/Modal'

export default function PatientDetail() {
  const { id } = useParams()
  const [p, setP] = useState<any>(null)
  const [editingBasic, setEditingBasic] = useState(false)
  const [editingStatus, setEditingStatus] = useState(false)
  const [savingBasic, setSavingBasic] = useState(false)
  const [savingStatus, setSavingStatus] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<any | null>(null)

  // Basic fields
  const [name, setName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [folderType, setFolderType] = useState('')
  const [address, setAddress] = useState('')
  const [doctorInCharge, setDoctorInCharge] = useState('')
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('')
  const [emergencyContactAddress, setEmergencyContactAddress] = useState('')
  
  // Status / medication
  const [patientStatus, setPatientStatus] = useState('')
  const [medication, setMedication] = useState('')
  const [medicationAmount, setMedicationAmount] = useState('')
  const [medicationDuration, setMedicationDuration] = useState('')
  const [dischargeDate, setDischargeDate] = useState('')
  const [dischargeTime, setDischargeTime] = useState('')
  const [lastTreatmentDate, setLastTreatmentDate] = useState('')

  useEffect(() => { if (id) fetchPatient() }, [id])

  const fetchPatient = async () => {
    try {
      const r = await getPatient(id!)
      setP(r.data)
      setName(r.data.name || '')
      setRoomNumber(r.data.roomNumber || '')
      setFolderType(r.data.folderType || '')
      setAddress(r.data.address || '')
      setDoctorInCharge(r.data.doctorInCharge || '')
      setEmergencyContactName(r.data.emergencyContactName || '')
      setEmergencyContactNumber(r.data.emergencyContactNumber || '')
      setEmergencyContactAddress(r.data.emergencyContactAddress || '')

      setPatientStatus(r.data.patientStatus || 'Admitted')
      setMedication(r.data.medication || '')
      setMedicationAmount(r.data.medicationAmount || '')
      setMedicationDuration(r.data.medicationDuration || '')
      setDischargeDate(r.data.dischargeDate ? r.data.dischargeDate.substring(0,10) : '')
      setDischargeTime(r.data.dischargeTime || '')
      setLastTreatmentDate(r.data.lastTreatmentDate ? r.data.lastTreatmentDate.substring(0,10) : '')
    } catch (err) { console.error(err) }
  }

  const saveBasic = async () => {
    setSavingBasic(true)
    try {
      await updatePatient(id!, { name, roomNumber, folderType, address, doctorInCharge, emergencyContactName, emergencyContactNumber, emergencyContactAddress })
      setEditingBasic(false)
      fetchPatient()
      toast.success('Basic info updated')
    } catch { toast.error('Failed to update basic info') } finally { setSavingBasic(false) }
  }

  const saveStatus = async () => {
    setSavingStatus(true)
    try {
      await updatePatientStatus(id!, { patientStatus, medication, medicationAmount, medicationDuration, dischargeDate, dischargeTime, lastTreatmentDate })
      setEditingStatus(false)
      fetchPatient()
      toast.success('Status updated')
    } catch { toast.error('Failed to update status') } finally { setSavingStatus(false) }
  }

  const handleUpload = async (file: File, customName?: string) => {
    try {
      const res = await uploadDocument(id!, file, customName)
      if (res.status === 200) {
        // Optimistically append new document
        setP((prev: any) => ({ ...prev, documents: [res.data, ...(prev?.documents || [])] }))
        toast.success('Document uploaded')
      }
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Upload failed')
    }
  }

  const handleDownload = async (doc: any) => {
    try {
      const authData = localStorage.getItem('carekeep-auth')
      let token: string | undefined
      if (authData) {
        try { token = JSON.parse(authData).state.token } catch {}
      }
      const url = `${import.meta.env.VITE_API_BASE || ''}/documents/${doc._id}?download=1`
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const dlName = doc.fileName || 'document'
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = dlName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objectUrl)
      toast.success('Download started')
    } catch (e: any) {
      toast.error(e.message || 'Download failed')
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

  const age = p.age !== undefined ? p.age : (p.dateOfBirth ? calculateAge(p.dateOfBirth) : '—')

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Section title="Patient Information" actions={
        <button onClick={() => setEditingBasic(!editingBasic)} className="px-3 py-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-white rounded-lg transition-colors">{editingBasic ? 'Cancel' : 'Edit'}</button>
      }>
        {!editingBasic && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Field label="Name" value={p.name} />
            <Field label="Room" value={p.roomNumber || '—'} />
            <Field label="Folder Type" value={p.folderType || '—'} />
            <Field label="Gender" value={p.gender || '—'} />
            <Field label="DOB" value={p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : '—'} />
            <Field label="Age" value={age} />
            <Field label="Address" value={p.address || '—'} />
            <Field label="Doctor In Charge" value={p.doctorInCharge || '—'} />
            <Field label="Emergency Contact" value={p.emergencyContactName || '—'} />
            <Field label="Emergency Phone" value={p.emergencyContactNumber || '—'} />
            <Field label="Emergency Address" value={p.emergencyContactAddress || '—'} />
            <Field label="Date Admitted" value={p.dateAdmitted ? new Date(p.dateAdmitted).toLocaleDateString() : '—'} />
            <Field label="Time Admitted" value={p.timeAdmitted || '—'} />
          </div>
        )}
        {editingBasic && (
          <div className="space-y-4">
            <InputRow label="Name" value={name} onChange={setName} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputRow label="Room" value={roomNumber} onChange={setRoomNumber} />
              <InputRow label="Folder Type" value={folderType} onChange={setFolderType} />
            </div>
            <InputRow label="Address" value={address} onChange={setAddress} />
            <InputRow label="Doctor In Charge" value={doctorInCharge} onChange={setDoctorInCharge} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputRow label="Emergency Contact" value={emergencyContactName} onChange={setEmergencyContactName} />
              <InputRow label="Emergency Phone" value={emergencyContactNumber} onChange={setEmergencyContactNumber} />
            </div>
            <InputRow label="Emergency Address" value={emergencyContactAddress} onChange={setEmergencyContactAddress} />
            <div className="flex gap-3 pt-2">
              <ActionButton onClick={saveBasic} loading={savingBasic} text={savingBasic ? 'Saving...' : 'Save'} />
              <ActionButton onClick={() => setEditingBasic(false)} text="Cancel" variant="secondary" />
            </div>
          </div>
        )}
      </Section>

      {/* Status & Treatment */}
      <Section title="Status & Treatment" actions={
        <button onClick={() => setEditingStatus(!editingStatus)} className="px-3 py-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-white rounded-lg transition-colors">{editingStatus ? 'Cancel' : 'Edit'}</button>
      }>
        {!editingStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Field label="Status" value={p.patientStatus} />
            <Field label="Medication" value={p.medication || '—'} />
            <Field label="Medication Amount" value={p.medicationAmount || '—'} />
            <Field label="Medication Duration" value={p.medicationDuration || '—'} />
            <Field label="Discharge Date" value={p.dischargeDate ? new Date(p.dischargeDate).toLocaleDateString() : '—'} />
            <Field label="Discharge Time" value={p.dischargeTime || '—'} />
            <Field label="Last Treatment Date" value={p.lastTreatmentDate ? new Date(p.lastTreatmentDate).toLocaleDateString() : '—'} />
          </div>
        )}
        {editingStatus && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectRow label="Status" value={patientStatus} onChange={setPatientStatus} options={["Admitted","Discharged","Deceased"]} />
              <InputRow label="Medication" value={medication} onChange={setMedication} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputRow label="Amount" value={medicationAmount} onChange={setMedicationAmount} />
              <InputRow label="Duration" value={medicationDuration} onChange={setMedicationDuration} />
              <InputRow label="Last Treatment Date" type="date" value={lastTreatmentDate} onChange={setLastTreatmentDate} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputRow label="Discharge Date" type="date" value={dischargeDate} onChange={setDischargeDate} />
              <InputRow label="Discharge Time" type="time" value={dischargeTime} onChange={setDischargeTime} />
            </div>
            <div className="flex gap-3 pt-2">
              <ActionButton onClick={saveStatus} loading={savingStatus} text={savingStatus ? 'Saving...' : 'Save'} />
              <ActionButton onClick={() => setEditingStatus(false)} text="Cancel" variant="secondary" />
            </div>
          </div>
        )}
      </Section>

      {/* Documents */}
      <Section title="Documents" actions={null}>
        <div className="space-y-3 mb-4 lg:mb-6">
          {p.documents?.length ? (
            p.documents.map((d: any) => (
              <div key={d._id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="min-w-0 flex-1">
                  <div className="text-sm lg:text-base text-white truncate">{d.fileName}</div>
                  <div className="text-xs text-gray-400">Uploaded {new Date(d.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewDoc(d)} className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">View</button>
                  <button onClick={() => handleDownload(d)} className="px-3 py-1 text-xs bg-gray-700/40 text-gray-300 rounded-lg hover:bg-gray-700/60 transition-colors">Download</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm">No documents uploaded yet</p>
            </div>
          )}
        </div>
        <FileUpload onUpload={handleUpload} label="Add Document" />
      </Section>
      <Modal open={!!previewDoc} onClose={() => setPreviewDoc(null)} title={previewDoc?.fileName}>
        {previewDoc && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-end gap-2">
              <button onClick={() => handleDownload(previewDoc)} className="px-3 py-1 text-xs bg-gray-700/40 text-gray-300 rounded-lg hover:bg-gray-700/60 transition-colors">Download</button>
            </div>
            {previewDoc.mimeType?.startsWith('image/') ? (
              <img src={previewDoc.fileUrl} alt={previewDoc.fileName} className="w-full max-h-[60vh] object-contain rounded-lg border border-gray-700" />
            ) : previewDoc.mimeType === 'application/pdf' ? (
              <iframe src={previewDoc.fileUrl} title={previewDoc.fileName} className="w-full h-[60vh] rounded-lg border border-gray-700" />
            ) : (
              <div className="text-sm text-gray-300 break-words">Preview not available. <a href={`${previewDoc.fileUrl}?download=1`} className="text-emerald-400 underline">Download</a></div>
            )}
            <div className="text-xs text-gray-400 flex flex-wrap gap-4">
              <span>Type: {previewDoc.mimeType || '—'}</span>
              <span>Size: {previewDoc.fileSize ? (previewDoc.fileSize / 1024).toFixed(1) + ' KB' : '—'}</span>
              <span>Uploaded: {new Date(previewDoc.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// Helpers
function Section({ title, actions, children }: any) {
  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div>{actions}</div>
      </div>
      {children}
    </div>
  )
}
function Field({ label, value }: any) {
  return (
    <div>
      <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">{label}</div>
      <div className="text-white text-sm break-words">{value || '—'}</div>
    </div>
  )
}
function InputRow({ label, value, onChange, type = 'text' }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input value={value} type={type} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
    </div>
  )
}
function SelectRow({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
function ActionButton({ onClick, text, variant = 'primary', loading = false }: any) {
  const base = 'px-5 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50'
  const styles = variant === 'secondary' ? 'bg-gray-800/50 hover:bg-gray-700/60 border border-gray-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
  return <button onClick={onClick} disabled={loading} className={base + ' ' + styles}>{text}</button>
}

function calculateAge(dateString: string) {
  const today = new Date()
  const dob = new Date(dateString)
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}
