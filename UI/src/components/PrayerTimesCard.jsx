import { motion } from 'framer-motion'
import { prayerIcons } from '../data/prayerData'

export function PrayerTimesCard({ prayerTimes, nextPrayer, loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-slate-800 animate-pulse" />
              <div className="h-4 w-16 rounded bg-slate-800 animate-pulse" />
            </div>
            <div className="h-6 w-20 rounded bg-slate-800 animate-pulse mb-2" />
            <div className="h-4 w-12 rounded bg-slate-800 animate-pulse" />
          </motion.div>
        ))}
      </div>
    )
  }

  if (!prayerTimes) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-8 backdrop-blur-xl text-center">
        <div className="text-slate-400">
          <p className="text-lg font-medium mb-2">No prayer times available</p>
          <p className="text-sm">Select a country and city to view prayer times</p>
        </div>
      </div>
    )
  }

  const prayers = [
    { name: 'Fajr', time: prayerTimes.Fajr, icon: prayerIcons.Fajr },
    { name: 'Sunrise', time: prayerTimes.Sunrise, icon: prayerIcons.Sunrise },
    { name: 'Dhuhr', time: prayerTimes.Dhuhr, icon: prayerIcons.Dhuhr },
    { name: 'Asr', time: prayerTimes.Asr, icon: prayerIcons.Asr },
    { name: 'Maghrib', time: prayerTimes.Maghrib, icon: prayerIcons.Maghrib },
    { name: 'Isha', time: prayerTimes.Isha, icon: prayerIcons.Isha },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {prayers.map((prayer, index) => {
        const isNextPrayer = nextPrayer === prayer.name

        return (
          <motion.div
            key={prayer.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className={`relative rounded-2xl border bg-slate-950/80 p-6 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden ${
              isNextPrayer
                ? 'border-emerald-400/30 bg-slate-900/95 ring-1 ring-emerald-400/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]'
                : 'border-white/10 hover:border-emerald-400/20 hover:bg-slate-900/90'
            }`}
          >
            {/* Background glow for next prayer */}
            {isNextPrayer && (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl" />
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`grid h-12 w-12 place-items-center rounded-xl text-2xl transition-all duration-300 ${
                  isNextPrayer
                    ? 'bg-emerald-400/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-800/50 text-slate-300'
                }`}>
                  {prayer.icon}
                </div>
                {isNextPrayer && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-emerald-200 font-medium border border-emerald-400/20"
                  >
                    Next
                  </motion.span>
                )}
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-1 transition-colors duration-300 ${
                  isNextPrayer ? 'text-emerald-200' : 'text-slate-100'
                }`}>
                  {prayer.name}
                </h3>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  isNextPrayer ? 'text-emerald-100' : 'text-slate-200'
                }`}>
                  {prayer.time}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
