import { motion } from 'framer-motion'
import { Clock3, Sparkles } from 'lucide-react'
import { useCountdownTimer } from '../hooks/useCountdownTimer'
import { prayerIcons } from '../data/prayerData'

const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export const PrayerCountdownWidget = ({ timings, onMidnightRefresh }) => {
  const { currentPrayer, nextPrayer, countdown } = useCountdownTimer(timings, onMidnightRefresh)

  if (!timings) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-200">
            <Sparkles className="h-4 w-4" />
            Next Prayer
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-100">{nextPrayer}</h2>
          <p className="mt-2 text-sm text-slate-400">Current Prayer: {currentPrayer || 'None yet'}</p>
        </div>

        <div className="rounded-3xl bg-slate-900/80 px-6 py-5 text-center shadow-[0_20px_60px_rgba(0,0,0,0.24)] ring-1 ring-emerald-400/10">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Countdown</p>
          <p className="mt-4 text-5xl font-semibold text-emerald-300 sm:text-6xl">{countdown}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-5">
        {prayerOrder.map((name) => {
          const isActive = name === currentPrayer
          const isNext = name === nextPrayer

          return (
            <div
              key={name}
              className={`rounded-3xl border px-4 py-3 text-center transition ${
                isNext
                  ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100 shadow-[0_20px_60px_rgba(16,185,129,0.15)]'
                  : isActive
                  ? 'border-sky-400/30 bg-sky-400/10 text-sky-100'
                  : 'border-white/10 bg-slate-900/70 text-slate-400'
              }`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{name}</p>
              <p className="mt-2 text-xl font-semibold text-slate-100">{timings[name]}</p>
              <p className="mt-1 text-[0.72rem] text-slate-500">{prayerIcons[name] || '•'}</p>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
