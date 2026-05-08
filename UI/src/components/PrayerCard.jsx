import { motion } from 'framer-motion'

export function PrayerCard({ prayer, highlight, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, delay }}
      whileHover={{ y: -6 }}
      className={`rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.2)] transition duration-300 ${
        highlight ? 'ring-1 ring-emerald-300/30 bg-slate-900/95' : 'hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-3xl bg-white/5 text-emerald-300 shadow-[0_20px_50px_rgba(38,183,98,0.15)]">
            {prayer.icon}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{prayer.name}</p>
            <p className="mt-2 text-xl font-semibold text-slate-100">{prayer.time}</p>
          </div>
        </div>
        {highlight && <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-emerald-200">Soon</span>}
      </div>
    </motion.div>
  )
}
