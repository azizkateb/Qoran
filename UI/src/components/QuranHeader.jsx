import { motion } from 'framer-motion'
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function QuranHeader({ surah, isBookmarked, onToggleBookmark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl"
    >
      <div className="mx-auto max-w-3xl px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/quran"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-emerald-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex-1 text-center">
            <h1
              className="text-2xl font-semibold text-slate-100 sm:text-3xl"
              style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
            >
              {surah.surahNameArabic}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{surah.surahNameEnglish}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBookmark}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-amber-300"
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current text-amber-300' : ''}`} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-emerald-300">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
