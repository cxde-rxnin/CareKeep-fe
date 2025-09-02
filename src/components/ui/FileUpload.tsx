import React, { useRef, useState } from 'react'

export default function FileUpload({ onUpload }: { onUpload: (file: File) => Promise<void> }) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    try {
      await onUpload(f)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <input type="file" ref={fileRef} onChange={handle} className="hidden" />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="px-4 py-2 rounded bg-emerald-500"
      >
        {busy ? 'Uploading…' : 'Upload file'}
      </button>
    </div>
  )
}
