import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Play, Pause, Volume2, VolumeX, Expand, Loader2 } from 'lucide-react'
import { useHLSPlayer } from '../hooks/useHLSPlayer'

const STREAM_URL = 'https://win.holol.com/live/sunnah/playlist.m3u8'

export const HaramLivePlayer = () => {
  const { t } = useTranslation()
  const { videoRef, loading, error, isPlaying, isMuted, togglePlay, toggleMute, goFullscreen } = useHLSPlayer(STREAM_URL)

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-[0_40px_120px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          controls={false}
          className="h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-200 shadow-glow">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-400 shadow-[0_0_30px_rgba(248,113,113,0.35)]" />
            {t('liveHaram.player.live')}
          </span>
          <span className="rounded-full bg-slate-900/70 px-3 py-2 text-xs text-slate-200">{t('liveHaram.player.location')}</span>
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-3">
          <button
            type="button"
            onClick={goFullscreen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-slate-100 transition hover:bg-white/15"
          >
            <Expand className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center px-4">
          <div className="inline-flex items-center gap-3 rounded-full bg-slate-950/70 px-4 py-3 text-slate-100 shadow-xl backdrop-blur-xl">
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-slate-100 transition hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-slate-100 transition hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <div className="min-w-[220px] text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('liveHaram.player.statusLabel')}</p>
              <p className="mt-1 text-sm text-slate-100">{isMuted ? t('liveHaram.player.muted') : t('liveHaram.player.unmuted')}</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
            <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-900/90 px-6 py-4 text-slate-100 shadow-xl backdrop-blur-xl">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
              <span>{t('liveHaram.player.loading')}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-x-4 bottom-4 rounded-3xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100 shadow-xl backdrop-blur-xl">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
