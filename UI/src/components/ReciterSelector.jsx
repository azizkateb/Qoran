import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { useAudio } from '../context/AudioContext'
import { useQuranAudio } from '../hooks/useAudioManager'
import { getAllReciters } from '../services/quranAudioService'

export function ReciterSelector({ onClose }) {
  const audio = useAudio()
  const { changeReciter } = useQuranAudio()
  const reciters = getAllReciters()
  const containerRef = useRef(null)

  const handleReciterChange = useCallback(
    async (reciterId) => {
      await changeReciter(reciterId)
      onClose?.()
    },
    [changeReciter, onClose]
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 bottom-full mb-3 w-72 rounded-2xl bg-slate-950 border border-white/10 shadow-2xl overflow-hidden z-50"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-slate-950 to-slate-900">
          <p className="text-sm font-semibold text-slate-100">Select Reciter</p>
          <p className="text-xs text-slate-400 mt-1">Change your Quran recitation</p>
        </div>

        {/* Reciters List */}
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          {Object.entries(reciters).map(([reciterId, reciter], index) => (
            <motion.button
              key={reciterId}
              type="button"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => handleReciterChange(reciterId)}
              className={`w-full px-4 py-3 text-left flex items-center justify-between gap-3 border-b border-white/10 transition duration-150 ease-out hover:bg-slate-800 ${
                audio.currentReciter === reciterId ? 'bg-emerald-400/10' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold transition ${
                    audio.currentReciter === reciterId ? 'text-emerald-300' : 'text-slate-200'
                  }`}
                >
                  {reciter.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">{reciter.nameAr}</p>
              </div>

              {audio.currentReciter === reciterId && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex-shrink-0"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10 bg-slate-950/50">
          <p className="text-xs text-slate-500">
            Changing reciter will reload the current surah.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
