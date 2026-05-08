import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SurahCard } from '../components/SurahCard.jsx'
import { LoadingSkeleton } from '../components/LoadingSkeleton.jsx'
import { DailyAyahCard } from '../components/DailyAyahCard.jsx'

const CACHE_KEY = 'noor_quran_arabic_data'
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
const API_URL = 'https://api.alquran.cloud/v1/quran/quran-uthmani'

function QuranHome() {
  const navigate = useNavigate()
  const [surahs, setSurahs] = useState([])
  const [filteredSurahs, setFilteredSurahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchQuranData = async () => {
      try {
        // Check if cached data exists and is still valid
        const cachedData = localStorage.getItem(CACHE_KEY)
        const cacheTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`)

        if (cachedData && cacheTimestamp) {
          const now = Date.now()
          const cacheAge = now - parseInt(cacheTimestamp)

          if (cacheAge < CACHE_EXPIRY) {
            
            const parsedData = JSON.parse(cachedData)
            setSurahs(parsedData)
            
            setLoading(false)
            return
          }
        }

        // Fetch from API if no valid cache
        
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()

        // Validate and extract surahs
        if (!data.data || !data.data.surahs) {
          throw new Error('Invalid API response structure')
        }

        const fetchedSurahs = data.data.surahs
        

        // Verify we have all 114 surahs
        if (fetchedSurahs.length !== 114) {
          
        }

        // Map API data to component format
        const mappedSurahs = fetchedSurahs.map((surah) => ({
          id: surah.number,
          surahNameArabic: surah.name,
          surahNameEnglish: surah.englishName,
          number: surah.number,
          numberOfAyahs: surah.numberOfAyahs,
          englishNameTranslation: surah.englishNameTranslation,
        }))

        // Cache the data
        localStorage.setItem(CACHE_KEY, JSON.stringify(mappedSurahs))
        localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString())

        setSurahs(mappedSurahs)
        
        setError(null)
      } catch (err) {
        
        setError(err.message)

        // Try to use cached data even if expired
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
          
          setSurahs(JSON.parse(cachedData))
          setError('Using offline data. Connect to internet for fresh data.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchQuranData()
  }, [])

  // Filter surahs based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSurahs(surahs)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = surahs.filter((surah) => {
      const matchesNumber = surah.number.toString() === query || surah.id.toString() === query
      const matchesEnglish = surah.surahNameEnglish.toLowerCase().includes(query)
      const matchesArabic = surah.surahNameArabic.includes(searchQuery)
      const matchesAyahs = surah.englishNameTranslation?.toLowerCase().includes(query)
      
      return matchesNumber || matchesEnglish || matchesArabic || matchesAyahs
    })

    setFilteredSurahs(filtered)
  }, [searchQuery, surahs])

  const { t } = useTranslation()

  const handleSurahClick = (surahId) => {
    navigate(`/quran/${surahId}`)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(126,211,255,0.12),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(249,209,91,0.08),transparent_20%),linear-gradient(180deg,#020d18_0%,#041928_50%,#061a2a_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            {t('quranHome.holyQuran')}
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-50 sm:text-6xl md:text-7xl">
            {t('quranHome.exploreTheQuran')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            {t('quranHome.selectSurah')}
          </p>

          {surahs.length > 0 && (
            <p className="mx-auto mt-2 text-sm text-emerald-300">
              {t('quranHome.allSurahs', { count: surahs.length })}
            </p>
          )}
        </motion.div>

        {/* Search Bar */}
        {surahs.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('quranHome.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-slate-100 placeholder-slate-500 transition focus:border-emerald-400/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
              />
            </div>
            {filteredSurahs.length > 0 && (
              <p className="mt-2 text-sm text-slate-400">
                Showing {filteredSurahs.length} of {surahs.length} Surahs
              </p>
            )}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <DailyAyahCard />
        </motion.div>

        {/* Error State */}
        {error && error !== 'Using offline data. Connect to internet for fresh data.' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Offline Warning */}
        {error === 'Using offline data. Connect to internet for fresh data.' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-lg border border-yellow-400/30 bg-yellow-500/10 p-4 text-sm text-yellow-300"
          >
            📱 Using cached data. Connect to internet for fresh updates.
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(12)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredSurahs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center"
              >
                {searchQuery ? (
                  <div>
                    <p className="text-slate-400">No Surahs found matching "{searchQuery}"</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-3 text-emerald-400 hover:text-emerald-300 transition text-sm"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-400">Unable to load Surahs. Please try again.</p>
                )}
              </motion.div>
            )}

            {/* Surah Grid */}
            {filteredSurahs.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredSurahs.map((surah) => (
                  <SurahCard
                    key={surah.id}
                    surah={surah}
                    onClick={() => handleSurahClick(surah.id)}
                  />
                ))}
              </motion.div>
            )}
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_40px_120px_rgba(0,0,0,0.22)] backdrop-blur-2xl sm:p-12"
        >
          <p className="text-sm uppercase tracking-[0.32em] text-emerald-200">Al-Quran Al-Kareem</p>
          <p className="mt-4 text-2xl font-semibold text-slate-100">The Noble Quran</p>
          <p className="mt-3 max-w-2xl text-slate-400">
            "This is the Book about which there is no doubt, a guidance for those conscious of Allah" — Quran 2:2
          </p>
        </motion.div>
      </div>
    </main>
  )
}

export default QuranHome
