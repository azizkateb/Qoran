import React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { useAudio } from '../context/AudioContext'
import { useAudioPlayback, useQuranAudio } from '../hooks/useAudioManager'

function AyahItemAudioComponent({ ayah, surah }) {
  const audio = useAudio()
  const { play, pause } = useAudioPlayback()
  const { goToAyah } = useQuranAudio()
  
  const isCurrentlyPlaying = audio.currentAyah?.number === ayah.number && audio.isPlaying
  const isCurrentAyah = audio.currentAyah?.number === ayah.number
  
  const handlePlayClick = useCallback(async () => {
    try {
      if (isCurrentlyPlaying) {
        pause()
      } else {
        const surahAyahs = audio.currentSurah?.ayahs || []
        const ayahIndex = surahAyahs.findIndex(a => a.number === ayah.number)
        
        if (ayahIndex >= 0) {
          await goToAyah(ayahIndex, true)
        }
      }
    } catch (error) {
      
    }
  }, [isCurrentlyPlaying, pause, audio.currentSurah?.ayahs, ayah.number, goToAyah])

  // Memoize className to prevent re-renders
  const containerClass = useMemo(() => {
    return isCurrentAyah
      ? 'border-emerald-400/50 bg-emerald-400/10 shadow-lg shadow-emerald-400/20'
      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
  }, [isCurrentAyah])

  const buttonClass = useMemo(() => {
    return isCurrentAyah
      ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
      : 'bg-white/10 text-slate-300 hover:bg-white/20'
  }, [isCurrentAyah])

  const badgeClass = useMemo(() => {
    return isCurrentAyah
      ? 'border-emerald-400 bg-emerald-400/20 text-emerald-200'
      : 'border-white/20 bg-white/5 text-slate-300 group-hover:border-white/30'
  }, [isCurrentAyah])

  const textClass = useMemo(() => {
    return isCurrentAyah ? 'text-emerald-100' : 'text-slate-100'
  }, [isCurrentAyah])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        borderColor: isCurrentAyah ? 'rgba(52, 211, 153, 0.5)' : 'rgba(255, 255, 255, 0.1)',
        backgroundColor: isCurrentAyah ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255, 255, 255, 0.05)',
      }}
      transition={{
        opacity: { duration: 0.25 },
        y: { duration: 0.25 },
        borderColor: { duration: 0.4, ease: 'easeInOut' },
        backgroundColor: { duration: 0.4, ease: 'easeInOut' },
      }}
      className={`group relative rounded-xl border overflow-hidden ${containerClass}`}
      style={{
        boxShadow: isCurrentAyah
          ? '0 0 30px rgba(52, 211, 153, 0.2), inset 0 0 20px rgba(52, 211, 153, 0.05)'
          : 'none',
      }}
    >
      {/* Smooth sliding highlight for the current ayah */}
      {isCurrentAyah && (
        <motion.div
          layoutId="ayah-highlight"
          className="absolute inset-0 rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/40"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      )}

      <div className="relative p-5 sm:p-6 space-y-4">
        {/* Header: Ayah Number & Play Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Ayah Number Badge */}
            <motion.div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 font-semibold text-sm transition-colors duration-300 ${badgeClass}`}
            >
              {ayah.numberInSurah}
            </motion.div>

            {/* Ayah Info */}
            <div className="flex-1 min-w-0">
              {isCurrentAyah && (
                <motion.p
                  key="now-playing"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs font-semibold text-emerald-400 mb-1 uppercase tracking-wider"
                >
                  {isCurrentlyPlaying ? '🎵 Now Playing' : '⏸️ Paused'}
                </motion.p>
              )}
              <p className="text-xs text-slate-400">
                {surah?.englishName} • Ayah {ayah.numberInSurah}
              </p>
            </div>
          </div>

          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayClick}
            disabled={audio.isBuffering}
            className={`flex-shrink-0 p-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 ${buttonClass}`}
            title={isCurrentlyPlaying ? 'Pause' : 'Play'}
          >
            {isCurrentlyPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </motion.button>
        </div>

        {/* Arabic Text */}
        <motion.div
          className={`text-center py-4 rounded-lg transition-colors duration-300 ${
            isCurrentAyah ? 'bg-emerald-400/5' : 'bg-white/5'
          }`}
        >
          <p
            className={`text-2xl sm:text-3xl leading-loose font-semibold transition-colors duration-300 ${textClass}`}
            style={{
              fontFamily: "'Noto Naskh Arabic', 'Scheherazade New', serif",
              textAlign: 'right',
              direction: 'rtl',
            }}
          >
            {ayah.text}
          </p>
        </motion.div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Ayah Number: {ayah.number}</span>
          {ayah.audio && (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400/50" />
              Audio available
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Memoize component to prevent unnecessary re-renders from parent updates
export const AyahItemAudio = React.memo(AyahItemAudioComponent, (prevProps, nextProps) => {
  // Only re-render if ayah changes or surah changes
  return prevProps.ayah.number === nextProps.ayah.number && prevProps.surah?.number === nextProps.surah?.number
})

AyahItemAudio.displayName = 'AyahItemAudio'

