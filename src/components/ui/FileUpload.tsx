import React, { useRef, useState } from 'react'

interface FileUploadProps {
  onUpload: (file: File, customName?: string) => Promise<void>
  accept?: string
  label?: string
}

export default function FileUpload({ onUpload, accept = 'image/*', label = 'Upload File' }: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [customName, setCustomName] = useState('')

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
    if (!customName) {
      const base = f.name.replace(/\.[^/.]+$/, '')
      setCustomName(base)
    }
  }

  const doUpload = async () => {
    if (!file) return
    setBusy(true)
    try {
      await onUpload(file, customName.trim() ? customName.trim() : undefined)
      // reset
      setFile(null)
      setPreview(null)
      setCustomName('')
      if (fileRef.current) fileRef.current.value = ''
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow disabled:opacity-50"
          disabled={busy}
        >
          {file ? 'Change File' : label}
        </button>
        {file && (
          <button
            type="button"
            onClick={doUpload}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-sm font-medium border border-emerald-600/40 disabled:opacity-50"
            disabled={busy}
          >
            {busy ? 'Uploading…' : 'Save'}
          </button>
        )}
      </div>
      <input type="file" ref={fileRef} onChange={handleSelect} className="hidden" accept={accept} />
      {file && (
        <div className="space-y-3 bg-gray-800/40 border border-gray-700 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-1">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg border border-gray-700" />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-gray-400 text-sm bg-gray-900/40 rounded-lg border border-dashed border-gray-600">
                  No preview
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Custom Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter a descriptive name"
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={busy}
                />
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Original: <span className="text-gray-300">{file.name}</span></div>
                <div>Type: <span className="text-gray-300">{file.type || '—'}</span></div>
                <div>Size: <span className="text-gray-300">{(file.size / 1024).toFixed(1)} KB</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
