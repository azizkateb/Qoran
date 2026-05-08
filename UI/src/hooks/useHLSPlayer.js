import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

export const useHLSPlayer = (src) => {
  const videoRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (!src || !videoRef.current) return

    const video = videoRef.current
    let hls
    let cancelled = false

    const initPlayer = async () => {
      setError(null)
      setLoading(true)

      try {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src
        } else if (Hls.isSupported()) {
          hls = new Hls({ enableWorker: true, lowLatencyMode: true })
          hls.loadSource(src)
          hls.attachMedia(video)

          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              setError('Stream error. Please reload the page.')
            }
          })
        } else {
          setError('HLS is not supported in this browser.')
          setLoading(false)
          return
        }

        const handleLoaded = () => {
          if (cancelled) return
          setLoading(false)
        }

        const handlePlay = () => {
          if (cancelled) return
          setIsPlaying(true)
        }

        const handlePause = () => {
          if (cancelled) return
          setIsPlaying(false)
        }

        const handleVolumeChange = () => {
          if (cancelled) return
          setIsMuted(video.muted)
        }

        video.addEventListener('loadeddata', handleLoaded)
        video.addEventListener('playing', handlePlay)
        video.addEventListener('pause', handlePause)
        video.addEventListener('volumechange', handleVolumeChange)

        video.muted = true
        setIsMuted(true)

        if (video.readyState >= 3) {
          handleLoaded()
        }
      } catch (err) {
        setError('Unable to initialize the live stream.')
        setLoading(false)
      }
    }

    initPlayer()

    return () => {
      cancelled = true
      if (video) {
        video.pause()
      }
      if (hls) {
        hls.destroy()
      }
    }
  }, [src])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      try {
        await video.play()
        setIsPlaying(true)
      } catch (err) {
        
      }
    } else {
      video.pause()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const goFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    const element = video.parentElement || video
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    }
  }

  return { videoRef, loading, error, isPlaying, isMuted, togglePlay, toggleMute, goFullscreen }
}
