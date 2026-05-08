import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronDown,
  Loader2,
  AlertCircle,
  Music,
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { useAudio } from '../context/AudioContext'
import { useAudioPlayback, useQuranAudio, usePlaybackProgress, formatTime } from '../hooks/useAudioManager'
import { ReciterSelector } from './ReciterSelector'
import { getAllReciters } from '../services/quranAudioService'

export function AudioPlayer() {
  const audio = useAudio()
  const { play, pause, seekTo } = useAudioPlayback()
  const { playNextAyah, playPreviousAyah } = useQuranAudio()
  const progress = usePlaybackProgress()
  const [showVolume, setShowVolume] = useState(false)
  const [showReciter, setShowReciter] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [previousVolume, setPreviousVolume] = useState(audio.volume)

  const handlePlayPause = useCallback(() => {
    if (audio.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [audio.isPlaying, play, pause])

  const handleVolumeChange = useCallback(
    (e) => {
      const newVolume = parseFloat(e.target.value)
      audio.setVolume(newVolume)
      if (newVolume > 0 && isMuted) {
        setIsMuted(false)
      }
    },
    [audio, isMuted]
  )

  const handleMute = useCallback(() => {
    if (isMuted) {
      audio.setVolume(previousVolume)
      setIsMuted(false)
    } else {
      setPreviousVolume(audio.volume)
      audio.setVolume(0)
      setIsMuted(true)
    }
  }, [audio, isMuted, previousVolume])

  const handleSpeedChange = useCallback(
    (speed) => {
      audio.setPlaybackSpeed(speed)
    },
    [audio]
  )

  const handleProgressChange = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = percent * audio.duration
      seekTo(newTime)
    },
    [audio.duration, seekTo]
  )

  if (!audio.isPlayerVisible || !audio.currentSurah) {
    return null
  }

  const reciters = getAllReciters()
  const reciterInfo = reciters[audio.currentReciter]?.name || 'Unknown Reciter'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-900 border-t border-white/10 shadow-2xl"
      >
        {/* Error Message */}
        <AnimatePresence>
          {audio.errorMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-2 bg-red-500/20 px-4 py-2 text-sm text-red-200 border-b border-red-500/20"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{audio.errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <motion.div
          onClick={handleProgressChange}
          className="relative h-1 w-full cursor-pointer bg-white/5 hover:bg-white/10 transition group"
          initial={false}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.25)]"
            animate={{ width: `${progress.percentage}%` }}
            transition={{ type: 'tween', duration: 0.8, ease: 'easeOut' }}
          />

          {/* Hover indicator */}
          <motion.div
            className="absolute top-1/2 h-3 w-3 rounded-full bg-emerald-400 shadow-lg -translate-y-1/2 opacity-0 group-hover:opacity-100"
            animate={{ left: `${progress.percentage}%` }}
            transition={{ type: 'tween', duration: 0.8, ease: 'easeOut' }}
          />
        </motion.div>

        {/* Main Player Container */}
        <div className="px-4 py-4 sm:px-6">
          {/* Currently Playing */}
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0 rounded-lg bg-emerald-400/20 flex items-center justify-center border border-emerald-400/30">
              <Music className="h-6 w-6 text-emerald-400" />
              {audio.isBuffering && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-lg border-2 border-emerald-400/0 border-t-emerald-400"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Now Playing</p>
              <p className="text-sm font-semibold text-slate-100 truncate">
                {audio.currentSurah?.name || 'Loading...'} {audio.currentAyah?.numberInSurah && `• Ayah ${audio.currentAyah.numberInSurah}`}
              </p>
              <p className="text-xs text-emerald-400 font-medium">
                {audio.currentSurah?.englishName || ''}
              </p>
            </div>

            <button
              onClick={() => audio.setPlayerVisible(false)}
              className="p-2 text-slate-400 hover:text-slate-200 transition rounded-lg hover:bg-white/5"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col gap-4 sm:gap-3">
            {/* Main Controls */}
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {/* Previous */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playPreviousAyah}
                disabled={audio.currentAyahIndex === 0}
                className="p-3 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <SkipBack className="h-6 w-6" />
              </motion.button>

              {/* Play/Pause */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handlePlayPause}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-300 transition shadow-lg hover:shadow-emerald-400/50"
              >
                {audio.isBuffering ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="h-7 w-7" />
                  </motion.div>
                ) : audio.isPlaying ? (
                  <Pause className="h-7 w-7" />
                ) : (
                  <Play className="h-7 w-7 ml-0.5" />
                )}
              </motion.button>

              {/* Next */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playNextAyah}
                disabled={audio.currentAyahIndex >= (audio.currentSurah?.ayahs?.length || 1) - 1}
                className="p-3 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <SkipForward className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-between gap-4">
              {/* Time Display */}
              <div className="flex gap-2 text-sm text-slate-300 font-mono bg-slate-800/50 px-3 py-1 rounded-lg">
                <span>{progress.current}</span>
                <span className="text-slate-500">/</span>
                <span>{progress.duration}</span>
              </div>

              {/* Speed Control */}
              <div className="flex items-center gap-1 bg-slate-800/30 rounded-lg p-1">
                <button
                  onClick={() => handleSpeedChange(0.75)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    audio.playbackSpeed === 0.75
                      ? 'bg-emerald-400 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  0.75x
                </button>
                <button
                  onClick={() => handleSpeedChange(1)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    audio.playbackSpeed === 1
                      ? 'bg-emerald-400 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  1x
                </button>
                <button
                  onClick={() => handleSpeedChange(1.25)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    audio.playbackSpeed === 1.25
                      ? 'bg-emerald-400 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  1.25x
                </button>
              </div>

              {/* Volume & Reciter */}
              <div className="flex items-center gap-2">
                {/* Reciter Selector */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowReciter(!showReciter)}
                    className="px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-400/10 transition text-sm font-medium border border-white/10 hover:border-emerald-400/30"
                  >
                    {reciterInfo}
                  </motion.button>
                  {showReciter && <ReciterSelector onClose={() => setShowReciter(false)} />}
                </div>

                {/* Volume Control */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleMute}
                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition rounded-lg"
                  >
                    {isMuted || audio.volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showVolume && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 bottom-full mb-2 p-4 rounded-lg bg-slate-900 border border-white/10 shadow-xl"
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={audio.volume}
                          onChange={handleVolumeChange}
                          className="w-24 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-400"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setShowVolume(!showVolume)}
                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition rounded-lg ml-1"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
