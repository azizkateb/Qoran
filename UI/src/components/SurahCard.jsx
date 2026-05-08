import { motion } from 'framer-motion'

export function SurahCard({ surah, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group relative w-full rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6 text-left shadow-[0_25px_80px_rgba(0,0,0,0.2)] transition duration-300 hover:border-emerald-300/30 hover:bg-slate-900/95 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    >
      <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-emerald-400/0 to-emerald-400/0 opacity-0 transition duration-300 group-hover:from-emerald-400/10 group-hover:to-emerald-400/5 group-hover:opacity-100" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-300/20">
              <span className="text-sm font-semibold">{surah.id}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Surah</p>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-semibold leading-tight text-slate-100" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
              {surah.surahNameArabic}
            </h3>
            <p className="text-sm text-slate-400">{surah.surahNameEnglish}</p>
          </div>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-emerald-300 transition duration-300 group-hover:bg-emerald-400/20 group-hover:text-emerald-200">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.button>
  )
}
