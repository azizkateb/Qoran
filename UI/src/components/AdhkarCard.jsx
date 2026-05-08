import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Plus, Minus } from 'lucide-react'

export function AdhkarCard({ adhkar, isCompleted, onToggle, onRepeatChange, currentRepeats = 0, theme = 'dark' }) {
  const [showBenefit, setShowBenefit] = useState(false)
  const isLightTheme = theme === 'light'

  const vibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15)
    }
  }

  const handleRepeatClick = (increment) => {
    const newRepeats = Math.max(0, Math.min(adhkar.repeat, currentRepeats + increment))
    onRepeatChange?.(newRepeats)
    vibrate()
  }

  const isFinished = currentRepeats >= adhkar.repeat

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className={`relative overflow-hidden rounded-[2rem] border transition-all duration-300 ${
        isFinished
          ? isLightTheme
            ? 'border-emerald-500/30 bg-emerald-50 shadow-[0_0_40px_rgba(16,185,129,0.12)]'
            : 'border-emerald-400/40 bg-gradient-to-br from-emerald-400/10 to-slate-900/60 shadow-[0_0_40px_rgba(16,185,129,0.2)]'
          : isLightTheme
            ? 'border-slate-200 bg-white shadow-[0_0_20px_rgba(15,23,42,0.08)]'
            : 'border-white/10 bg-slate-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.18)]'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.12),transparent_55%)] pointer-events-none" />
      <div className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${isLightTheme ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-400/10 text-emerald-200'}`}>
        {isFinished ? 'منجز' : 'قيد التنفيذ'}
      </div>

      <div className="relative p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-slate-100 arabic-text">{adhkar.title}</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{adhkar.text}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              vibrate()
              onToggle(adhkar.id)
            }}
            aria-label={isFinished ? 'Mark as incomplete' : 'Mark as complete'}
            className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isFinished
                ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/30'
                : 'border-2 border-emerald-400/25 text-emerald-300 hover:border-emerald-300 hover:text-emerald-200'
            }`}
          >
            {isFinished ? <Check className="h-5 w-5" /> : <span className="text-sm">✓</span>}
          </motion.button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between gap-3 text-slate-400 text-sm mb-3">
            <p>Repeats</p>
            <p className="font-semibold text-slate-100">{currentRepeats}/{adhkar.repeat}</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRepeatClick(-1)}
              disabled={currentRepeats === 0}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-slate-300 hover:text-emerald-300 disabled:opacity-40 transition"
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            <div className="flex-1 rounded-3xl bg-white/5 py-3 text-center font-semibold text-emerald-300 text-lg">
              <motion.span
                key={currentRepeats}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {currentRepeats}
              </motion.span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRepeatClick(1)}
              disabled={currentRepeats >= adhkar.repeat}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-slate-300 hover:text-emerald-300 disabled:opacity-40 transition"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
            <span>Progress</span>
            <span className="font-semibold text-slate-100">{Math.round((currentRepeats / adhkar.repeat) * 100)}%</span>
          </div>
          <div className="relative h-2 rounded-full bg-slate-900 overflow-hidden">
            <motion.div
              animate={{ width: `${(currentRepeats / adhkar.repeat) * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 shadow-[0_0_16px_rgba(56,189,248,0.4)]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowBenefit((prev) => !prev)}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left text-sm text-emerald-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/10"
          >
            {showBenefit ? 'Hide benefit' : 'View benefit'}
          </button>
          <div className="rounded-2xl bg-gradient-to-r from-amber-400/15 to-yellow-400/15 px-4 py-3 text-sm font-semibold text-amber-200">
            +{adhkar.xp} XP
          </div>
        </div>

        {showBenefit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100"
          >
            {adhkar.benefit}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
