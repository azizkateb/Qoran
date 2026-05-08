import { createContext, useContext, useReducer, useCallback, useRef } from 'react'

const AudioContext = createContext()

const initialState = {
  // Playback state
  isPlaying: false,
  currentSurah: null,
  currentAyah: null,
  currentAyahIndex: 0,
  currentReciter: 'ar.alafasy',
  
  // Player state
  isBuffering: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  playbackSpeed: 1,
  
  // UI state
  isPlayerVisible: true,
  errorMessage: null,
  
  // Cache
  cachedAyahs: {},
}

const audioReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload }
    
    case 'SET_CURRENT_SURAH':
      return { ...state, currentSurah: action.payload, currentAyahIndex: 0, currentAyah: null }
    
    case 'SET_CURRENT_AYAH':
      return { ...state, currentAyah: action.payload, currentAyahIndex: action.index }
    
    case 'SET_RECITER':
      return { ...state, currentReciter: action.payload, isPlaying: false, currentTime: 0 }
    
    case 'SET_BUFFERING':
      return { ...state, isBuffering: action.payload }
    
    case 'SET_TIME':
      return { ...state, currentTime: action.payload }
    
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    
    case 'SET_VOLUME':
      return { ...state, volume: action.payload }
    
    case 'SET_PLAYBACK_SPEED':
      return { ...state, playbackSpeed: action.payload }
    
    case 'SET_PLAYER_VISIBLE':
      return { ...state, isPlayerVisible: action.payload }
    
    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload }
    
    case 'NEXT_AYAH':
      if (!state.currentSurah || state.currentAyahIndex >= state.currentSurah.ayahs.length - 1) {
        return state
      }
      const nextAyah = state.currentSurah.ayahs[state.currentAyahIndex + 1]
      return { ...state, currentAyah: nextAyah, currentAyahIndex: state.currentAyahIndex + 1, currentTime: 0 }
    
    case 'PREV_AYAH':
      if (state.currentAyahIndex === 0) return state
      const prevAyah = state.currentSurah.ayahs[state.currentAyahIndex - 1]
      return { ...state, currentAyah: prevAyah, currentAyahIndex: state.currentAyahIndex - 1, currentTime: 0 }
    
    case 'CACHE_AYAHS':
      return { ...state, cachedAyahs: { ...state.cachedAyahs, [action.surahId]: action.ayahs } }
    
    case 'RESET_PLAYER':
      return { ...state, isPlaying: false, currentTime: 0, duration: 0, currentAyah: null, currentSurah: null }
    
    default:
      return state
  }
}

export function AudioProvider({ children }) {
  const [state, dispatch] = useReducer(audioReducer, initialState)
  const audioRef = useRef(null)

  const setPlaying = useCallback((isPlaying) => {
    dispatch({ type: 'SET_PLAYING', payload: isPlaying })
  }, [])

  const setCurrentSurah = useCallback((surah) => {
    dispatch({ type: 'SET_CURRENT_SURAH', payload: surah })
  }, [])

  const setCurrentAyah = useCallback((ayah, index) => {
    dispatch({ type: 'SET_CURRENT_AYAH', payload: ayah, index })
  }, [])

  const setReciter = useCallback((reciter) => {
    dispatch({ type: 'SET_RECITER', payload: reciter })
  }, [])

  const setBuffering = useCallback((isBuffering) => {
    dispatch({ type: 'SET_BUFFERING', payload: isBuffering })
  }, [])

  const setCurrentTime = useCallback((time) => {
    dispatch({ type: 'SET_TIME', payload: time })
  }, [])

  const setDuration = useCallback((duration) => {
    dispatch({ type: 'SET_DURATION', payload: duration })
  }, [])

  const setVolume = useCallback((volume) => {
    dispatch({ type: 'SET_VOLUME', payload: volume })
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [])

  const setPlaybackSpeed = useCallback((speed) => {
    dispatch({ type: 'SET_PLAYBACK_SPEED', payload: speed })
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }, [])

  const setPlayerVisible = useCallback((visible) => {
    dispatch({ type: 'SET_PLAYER_VISIBLE', payload: visible })
  }, [])

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const nextAyah = useCallback(() => {
    dispatch({ type: 'NEXT_AYAH' })
  }, [])

  const prevAyah = useCallback(() => {
    dispatch({ type: 'PREV_AYAH' })
  }, [])

  const cacheAyahs = useCallback((surahId, ayahs) => {
    dispatch({ type: 'CACHE_AYAHS', payload: { surahId, ayahs } })
  }, [])

  const resetPlayer = useCallback(() => {
    dispatch({ type: 'RESET_PLAYER' })
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  const value = {
    // State
    ...state,
    audioRef,
    
    // Actions
    setPlaying,
    setCurrentSurah,
    setCurrentAyah,
    setReciter,
    setBuffering,
    setCurrentTime,
    setDuration,
    setVolume,
    setPlaybackSpeed,
    setPlayerVisible,
    setError,
    nextAyah,
    prevAyah,
    cacheAyahs,
    resetPlayer,
  }

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}
