import { motion } from 'framer-motion'
import { Sparkles, CalendarDays, Star, Bolt } from 'lucide-react'

export function AdhkarProgressHeader({ completed, total, streak, level, totalXP, theme = 'dark' }) {
  const progressPercentage = total > 0 ? Math.min(100, (completed / total) * 100) : 0
  const isAllCompleted = completed === total && total > 0
  const isLightTheme = theme === 'light'

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-4 z-20 rounded-[2.5rem] border backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.25)] mb-8 ${isLightTheme ? 'border-slate-200 bg-white/90 text-slate-950' : 'border-white/10 bg-slate-950/90 text-slate-100'}`}
    >
      <div className="p-6 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className={`rounded-3xl border px-4 py-3 shadow-glow ${isLightTheme ? 'border-slate-200 bg-slate-50' : 'border-emerald-400/10 bg-emerald-400/5'}`}>
            <p className={`text-xs uppercase tracking-[0.32em] ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>{completed}/{total}</p>
            <p className={`mt-1 text-2xl font-bold ${isLightTheme ? 'text-emerald-700' : 'text-emerald-300'}`}>Completed</p>
          </div>

          <div className="text-right">
            <p className={`text-xs uppercase tracking-[0.28em] ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>Daily Adhkar</p>
            <h2 className={`text-3xl font-semibold ${isLightTheme ? 'text-slate-950' : 'text-slate-100'}`}>Your spiritual streak</h2>
          </div>
        </div>

        <div className={`rounded-3xl border p-4 shadow-inner ${isLightTheme ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-950/70'}`}>
          <div className={`flex items-center justify-between gap-4 text-sm mb-3 ${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
            <span>{isAllCompleted ? '✨ All completed for today' : `${Math.round(progressPercentage)}% complete`}</span>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${isLightTheme ? 'bg-emerald-100 text-emerald-700' : 'bg-white/5 text-emerald-300'}`}>
              <Sparkles className="h-4 w-4" /> Daily flow
            </span>
          </div>
          <div className="relative h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
            <motion.div
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 shadow-[0_0_24px_rgba(34,197,94,0.45)]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/10 to-slate-900/60 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.08)]"
          >
            <div className="flex items-center gap-3 text-emerald-300 mb-3">
              <span className="rounded-2xl bg-emerald-500/15 p-2 text-emerald-300">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Streak</p>
                <p className="text-2xl font-semibold text-slate-100">{streak} days</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">Today’s consistency keeps your faith flowing.</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-400/10 to-slate-900/60 p-5 shadow-[0_20px_60px_rgba(245,158,11,0.08)]"
          >
            <div className="flex items-center gap-3 text-amber-300 mb-3">
              <span className="rounded-2xl bg-amber-500/15 p-2 text-amber-300">
                <Star className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Level</p>
                <p className="text-2xl font-semibold text-slate-100">{level}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">Your journey is growing with every dhikr.</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-slate-900/60 p-5 shadow-[0_20px_60px_rgba(139,92,246,0.08)]"
          >
            <div className="flex items-center gap-3 text-purple-300 mb-3">
              <span className="rounded-2xl bg-purple-500/15 p-2 text-purple-300">
                <Bolt className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">XP</p>
                <p className="text-2xl font-semibold text-slate-100">{totalXP}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">Fuel your spiritual growth with every repeat.</p>
          </motion.div>
        </div>

        <div className={`rounded-3xl border p-4 ${isLightTheme ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-950/70'}`}>
          <div className={`flex items-center justify-between text-xs mb-2 ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Level {level} Progress</span>
            <span className={`font-semibold ${isLightTheme ? 'text-slate-950' : 'text-slate-100'}`}>{totalXP % 100}/100 XP</span>
          </div>
          <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              animate={{ width: `${((totalXP % 100) / 100) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 shadow-[0_0_16px_rgba(139,92,246,0.45)]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
