import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QuranHeader } from '../components/QuranHeader.jsx'
import { AyahText } from '../components/AyahText.jsx'
import { AyahItemAudio } from '../components/AyahItemAudio.jsx'
import { useAudio } from '../context/AudioContext'
import { useQuranAudio, useAutoScrollAyah } from '../hooks/useAudioManager'

const CACHE_KEY = 'noor_quran_arabic_data'

function SurahReader() {
  const { surahId } = useParams()
  const audio = useAudio()
  const { loadSurah } = useQuranAudio()
  const currentAyahRef = useAutoScrollAyah()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [selectedAyah, setSelectedAyah] = useState(null)
  const [loading, setLoading] = useState(true)
  const [audioError, setAudioError] = useState(null)

  useEffect(() => {
    const loadSurahData = async () => {
      try {
        const surahNumber = parseInt(surahId)
        setLoading(true)
        setAudioError(null)

        await loadSurah(surahNumber, audio.currentReciter)
        setLoading(false)
      } catch (error) {
        
        setAudioError(error.message)
        setLoading(false)
      }
    }

    loadSurahData()
  }, [surahId, loadSurah, audio.currentReciter])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-emerald-400" />
      </div>
    )
  }

  if (!audio.currentSurah) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Surah not found</p>
          <button
            onClick={() => window.history.back()}
            className="text-emerald-400 hover:text-emerald-300 transition"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  // Extract ayahs and ensure they exist
  const ayahs = audio.currentSurah?.ayahs || []

  return (
    <main className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_40%),linear-gradient(180deg,#020d18_0%,#041928_50%,#061a2a_100%)]" />

      <QuranHeader
        surah={audio.currentSurah}
        isBookmarked={isBookmarked}
        onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
      />

      <div className="relative mx-auto max-w-3xl px-6 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:p-12"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-500/10" />
            <span className="h-[2px] flex-1 bg-gradient-to-r from-emerald-400/20 via-transparent to-transparent" />
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-500/10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-semibold text-slate-100 sm:text-6xl" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
              {audio.currentSurah?.name || 'Loading...'}
            </h1>
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-200">
              {audio.currentSurah?.englishName}
            </p>
            {audio.currentSurah?.englishNameTranslation && (
              <p className="text-slate-400">
                {audio.currentSurah?.englishNameTranslation}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-transparent to-emerald-400/20" />
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-500/10" />
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-500/10" />
            <span className="h-[2px] flex-1 bg-gradient-to-r from-emerald-400/20 via-transparent to-transparent" />
          </div>

          <div className="pt-4 text-sm text-slate-400">
            {audio.currentSurah?.numberOfAyahs || audio.currentSurah?.ayahs?.length || 'Loading...'} Ayahs
          </div>
        </motion.div>

        <div className="space-y-6">
          {audio.currentSurah && audio.currentSurah.ayahs && audio.currentSurah.ayahs.length > 0 ? (
            audio.currentSurah.ayahs.map((ayah, index) => (
              <div
                key={ayah.number}
                ref={audio.currentAyahIndex === index ? currentAyahRef : null}
              >
                <AyahItemAudio ayah={ayah} surah={audio.currentSurah} />
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-slate-400">
              No ayahs available
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:p-12"
        >
          <div className="h-[2px] w-16 mx-auto bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent mb-6" />
          <p className="text-sm uppercase tracking-[0.32em] text-emerald-200/80">End of Surah</p>
          <p className="mt-4 text-2xl font-semibold text-slate-100">
            سورة {audio.currentSurah?.name}
          </p>
          <p className="mt-2 text-slate-400">May Allah grant us understanding and wisdom.</p>
        </motion.div>

        <div className="my-12 h-8" />
      </div>
    </main>
  )
}

export default SurahReader
