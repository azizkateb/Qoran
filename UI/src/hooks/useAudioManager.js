import { useEffect, useCallback, useRef } from 'react'
import { useAudio } from '../context/AudioContext'
import { fetchSurahAudio } from '../services/quranAudioService'

/**
 * Hook for managing audio playback with automatic sequential ayah continuation
 */
export function useAudioPlayback() {
  const {
    audioRef,
    currentSurah,
    currentAyah,
    currentAyahIndex,
    isPlaying,
    volume,
    playbackSpeed,
    setPlaying,
    setCurrentTime,
    setDuration,
    setBuffering,
    setError,
    setCurrentAyah,
  } = useAudio()

  // Use refs to avoid stale closure issues in event handlers
  const stateRef = useRef({
    currentSurah,
    currentAyahIndex,
    isPlaying,
  })

  useEffect(() => {
    stateRef.current = { currentSurah, currentAyahIndex, isPlaying }
  }, [currentSurah, currentAyahIndex, isPlaying])

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
    }

    const audioElement = audioRef.current

    // Only initialize event listeners once
    if (!audioElement.__playbackInitialized) {
      const handlePlay = () => {
        
        setPlaying(true)
      }

      const handlePause = () => {
        
        setPlaying(false)
      }

      const handleTimeUpdate = () => {
        setCurrentTime(audioElement.currentTime)
      }

      const handleLoadedMetadata = () => {
        setDuration(audioElement.duration)
      }

      const handleCanPlay = () => {
        setBuffering(false)
      }

      const handleWaiting = () => {
        setBuffering(true)
      }

      // CRITICAL: Handle automatic transition to next ayah
      const handleEnded = () => {
        
        const { currentSurah: surah, currentAyahIndex: index, isPlaying: playing } = stateRef.current

        if (!surah || !surah.ayahs) {
          
          setPlaying(false)
          return
        }

        const nextIndex = index + 1
        if (nextIndex < surah.ayahs.length) {
          
          const nextAyah = surah.ayahs[nextIndex]
          // CRITICAL: Explicitly ensure isPlaying is true so the playback effect triggers auto-play
          setPlaying(true)
          setCurrentAyah(nextAyah, nextIndex)
        } else {
          
          setPlaying(false)
        }
      }

      const handleError = (e) => {
        const errorMessage = `Audio error: ${e.target.error?.message || 'Unknown'}`
        
        setError('Failed to load audio')
        setBuffering(false)
      }

      audioElement.addEventListener('play', handlePlay)
      audioElement.addEventListener('pause', handlePause)
      audioElement.addEventListener('timeupdate', handleTimeUpdate)
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata)
      audioElement.addEventListener('canplay', handleCanPlay)
      audioElement.addEventListener('waiting', handleWaiting)
      audioElement.addEventListener('ended', handleEnded)
      audioElement.addEventListener('error', handleError)

      audioElement.__playbackInitialized = true
      

      return () => {
        audioElement.removeEventListener('play', handlePlay)
        audioElement.removeEventListener('pause', handlePause)
        audioElement.removeEventListener('timeupdate', handleTimeUpdate)
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audioElement.removeEventListener('canplay', handleCanPlay)
        audioElement.removeEventListener('waiting', handleWaiting)
        audioElement.removeEventListener('ended', handleEnded)
        audioElement.removeEventListener('error', handleError)
      }
    }
  }, [audioRef, setPlaying, setCurrentTime, setDuration, setBuffering, setError, setCurrentAyah])

  // Apply volume and playback speed
  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) return

    if (audioElement.volume !== volume) {
      audioElement.volume = volume
    }

    if (audioElement.playbackRate !== playbackSpeed) {
      audioElement.playbackRate = playbackSpeed
    }
  }, [audioRef, volume, playbackSpeed])

  // Load and play current ayah
  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement || !currentAyah?.audio) {
      return
    }

    const nextSrc = currentAyah.audio

    // Only reload if source changed
    if (audioElement.src !== nextSrc) {
      
      audioElement.pause()
      audioElement.src = nextSrc
      audioElement.load()
      setBuffering(true)
    }

    // Auto-play if playback is enabled
    if (isPlaying) {
      
      
      // Small delay to ensure audio is ready
      const playPromise = audioElement.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            
          })
          .catch((error) => {
            
            // Only treat as error if not NotAllowedError (which is expected in some contexts)
            if (error.name !== 'NotAllowedError') {
              setError('Unable to continue playback automatically')
            }
          })
      }
    }
  }, [currentAyah?.audio, isPlaying, audioRef, setBuffering, setError])

  // Additional safety effect: ensure auto-play when ayah index changes
  // This catches cases where isPlaying state might not be perfectly synchronized
  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement || !currentAyah?.audio || !currentAyah?.numberInSurah) {
      return
    }

    // If we just transitioned and audio is not playing but should be, force it
    const checkAndPlay = async () => {
      try {
        // Only auto-play if the audio seems paused but should be playing
        if (stateRef.current.isPlaying && audioElement.paused && audioElement.src) {
          
          await audioElement.play()
        }
      } catch (error) {
        
      }
    }

    // Add small delay to allow audio to load
    const timeoutId = setTimeout(checkAndPlay, 100)
    return () => clearTimeout(timeoutId)
  }, [currentAyahIndex])


  const play = useCallback(async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
      } catch (error) {
        
        setError('Failed to play audio')
      }
    }
  }, [audioRef, setError])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [audioRef])

  const seekTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [audioRef])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
    }
  }, [audioRef, setPlaying])

  return { play, pause, seekTo, stop }
}

/**
 * Hook for loading and playing a surah
 */
export function useQuranAudio() {
  const {
    audioRef,
    currentSurah,
    currentAyah,
    currentAyahIndex,
    isPlaying,
    setError,
    setBuffering,
    setCurrentSurah,
    setCurrentAyah,
    cacheAyahs,
  } = useAudio()
  const { play } = useAudioPlayback()
  const loadingRef = useRef(false)

  const loadSurah = useCallback(
    async (surahNumber, reciter = 'ar.alafasy') => {
      if (loadingRef.current) return null

      try {
        loadingRef.current = true
        setError(null)
        setBuffering(true)

        const surah = await fetchSurahAudio(surahNumber, reciter)
        setCurrentSurah(surah)
        cacheAyahs(surahNumber, surah.ayahs)

        if (surah.ayahs.length > 0) {
          const firstAyah = surah.ayahs[0]
          setCurrentAyah(firstAyah, 0)

          if (audioRef.current && firstAyah.audio) {
            audioRef.current.pause()
            audioRef.current.src = firstAyah.audio
            audioRef.current.load()
          }
        }

        loadingRef.current = false
        setBuffering(false)
        return surah
      } catch (error) {
        
        setError(error.message || 'Failed to load surah')
        loadingRef.current = false
        setBuffering(false)
        return null
      }
    },
    [audioRef, setError, setBuffering, setCurrentSurah, cacheAyahs, setCurrentAyah]
  )

  const playAyah = useCallback(
    async (ayahNumber) => {
      try {
        if (!currentSurah || !currentSurah.ayahs) return

        const ayah = currentSurah.ayahs.find((a) => a.numberInSurah === ayahNumber)
        if (!ayah) return

        const index = currentSurah.ayahs.indexOf(ayah)
        setCurrentAyah(ayah, index)

        if (audioRef.current && ayah.audio) {
          audioRef.current.pause()
          audioRef.current.src = ayah.audio
          audioRef.current.load()
          await play()
        }
      } catch (error) {
        
        setError('Failed to play ayah')
      }
    },
    [audioRef, currentSurah, play, setCurrentAyah, setError]
  )

  const goToAyah = useCallback(
    async (index, autoPlay = true) => {
      if (!currentSurah || !currentSurah.ayahs) return
      if (index < 0 || index >= currentSurah.ayahs.length) return

      const nextAyah = currentSurah.ayahs[index]
      setCurrentAyah(nextAyah, index)

      if (audioRef.current && nextAyah.audio) {
        audioRef.current.pause()
        audioRef.current.src = nextAyah.audio
        audioRef.current.load()
        if (autoPlay || isPlaying) {
          await play()
        }
      }
    },
    [audioRef, currentSurah, isPlaying, play, setCurrentAyah]
  )

  const playNextAyah = useCallback(async () => {
    if (!currentSurah || !currentSurah.ayahs) return
    await goToAyah(currentAyahIndex + 1)
  }, [currentSurah, currentAyahIndex, goToAyah])

  const playPreviousAyah = useCallback(async () => {
    if (!currentSurah || !currentSurah.ayahs) return
    await goToAyah(currentAyahIndex - 1)
  }, [currentSurah, currentAyahIndex, goToAyah])

  const changeReciter = useCallback(
    async (newReciter) => {
      if (!currentSurah) return

      try {
        setError(null)
        setCurrentSurah(null)
        const surah = await loadSurah(currentSurah.number, newReciter)
        return surah
      } catch (error) {
        
        setError('Failed to change reciter')
        return null
      }
    },
    [currentSurah, loadSurah, setError, setCurrentSurah]
  )

  return {
    loadSurah,
    playAyah,
    playNextAyah,
    playPreviousAyah,
    changeReciter,
  }
}

/**
 * Hook for tracking playback progress
 */
export function usePlaybackProgress() {
  const audio = useAudio()

  const progressPercentage = audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0

  const getProgressDisplay = useCallback(() => {
    return {
      current: formatTime(audio.currentTime),
      duration: formatTime(audio.duration),
      percentage: progressPercentage,
    }
  }, [audio.currentTime, audio.duration, progressPercentage])

  return getProgressDisplay()
}

/**
 * Utility function to format time
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Hook for detecting when to auto-scroll to current ayah
 */
export function useAutoScrollAyah() {
  const audio = useAudio()
  const currentAyahRef = useRef(null)
  const prevAyahIndexRef = useRef(null)

  useEffect(() => {
    // Only scroll when the ayah index ACTUALLY changes, not on every render
    // This prevents duplicate scroll triggers during state updates
    if (prevAyahIndexRef.current !== audio.currentAyahIndex && audio.isPlaying) {
      // Use requestAnimationFrame to ensure smooth scroll after render
      const scrollTimer = requestAnimationFrame(() => {
        if (currentAyahRef.current) {
          currentAyahRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      })
      
      prevAyahIndexRef.current = audio.currentAyahIndex
      
      return () => cancelAnimationFrame(scrollTimer)
    }
  }, [audio.currentAyahIndex, audio.isPlaying])

  return currentAyahRef
}
