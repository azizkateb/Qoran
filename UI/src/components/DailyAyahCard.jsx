import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useDailyAyah } from '../useDailyAyah'
import { Sparkles, Share2, Bookmark, BookmarkCheck } from 'lucide-react'

export const DailyAyahCard = ({ showTitle = true }) => {
  const { ayah, loading } = useDailyAyah()
  const [bookmarked, setBookmarked] = useState(false)
  const [shared, setShared] = useState(false)

  // Check if current ayah is bookmarked
  useEffect(() => {
    if (ayah) {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedAyahs') || '[]')
      const isBookmarked = bookmarks.some(b => b.text === ayah.text)
      setBookmarked(isBookmarked)
    }
  }, [ayah])

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-8 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    const text = `"${ayah.text}" - ${ayah.surah} Ayah ${ayah.number}`
    try {
      await navigator.clipboard.writeText(text)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    } catch (err) {
      
    }
  }

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedAyahs') || '[]')
    const isBookmarked = bookmarks.some(b => b.text === ayah.text)
    
    if (isBookmarked) {
      const filtered = bookmarks.filter(b => b.text !== ayah.text)
      localStorage.setItem('bookmarkedAyahs', JSON.stringify(filtered))
      setBookmarked(false)
    } else {
      bookmarks.push(ayah)
      localStorage.setItem('bookmarkedAyahs', JSON.stringify(bookmarks))
      setBookmarked(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-lg mx-auto bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400">
          <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Title */}
      {showTitle && (
        <div className="flex items-center justify-center mb-6 relative z-10">
          <Sparkles className="h-5 w-5 text-emerald-400 mr-2" />
          <h2 className="text-xl font-semibold text-emerald-200">Reflect Today</h2>
          <Sparkles className="h-5 w-5 text-emerald-400 ml-2" />
        </div>
      )}

      {/* Ayah Text */}
      <div className="text-center mb-6 relative z-10">
        <p
          className="text-2xl md:text-3xl text-slate-100 leading-relaxed font-medium"
          style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif", lineHeight: '2.2' }}
          dir="rtl"
        >
          {ayah.text}
        </p>
      </div>

      {/* Surah Info */}
      <div className="text-center mb-6 relative z-10">
        <p className="text-sm text-emerald-300 font-medium">
          {ayah.surah} - Ayah {ayah.number}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-200 text-sm font-medium transition-colors"
        >
          <Share2 className="h-4 w-4" />
          {shared ? 'Copied!' : 'Share'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBookmark}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600/20 hover:bg-slate-600/30 rounded-lg text-slate-300 text-sm font-medium transition-colors"
        >
          {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          {bookmarked ? 'Saved' : 'Save'}
        </motion.button>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400">
          <circle cx="50" cy="50" r="40" fill="currentColor" />
        </svg>
      </div>
    </motion.div>
  )
}
