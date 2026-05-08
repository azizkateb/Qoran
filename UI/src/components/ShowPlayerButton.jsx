import { motion } from 'framer-motion'
import { Music } from 'lucide-react'
import { useAudio } from '../context/AudioContext'

export function ShowPlayerButton() {
  const audio = useAudio()

  if (audio.isPlayerVisible || !audio.currentSurah) {
    return null
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => audio.setPlayerVisible(true)}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-emerald-400 text-slate-950 shadow-lg hover:bg-emerald-300 transition px-4 py-3 font-semibold"
    >
      <Music className="h-5 w-5" />
      <span className="hidden sm:inline">Show Player</span>
    </motion.button>
  )
}
