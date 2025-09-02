import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({
  open,
  onClose,
  children,
  title
}: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-lg p-20 md:p-0"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative z-10 w-11/12 max-w-2xl bg-gray-900/50 border border-emerald-500/10 rounded-2xl p-6"
          >
            {title && <h3 className="text-lg font-semibold text-emerald-400 mb-3">{title}</h3>}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
