import { motion } from 'framer-motion'

const accentStyles = {
  emerald: 'from-emerald-400/15 to-emerald-500/10 text-emerald-200',
  amber: 'from-amber-400/15 to-orange-400/10 text-amber-200',
}

export function FeatureCard({ feature, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65 }}
      whileHover={{ y: -6 }}
      className={`rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.16)] transition duration-300 hover:border-emerald-300/20 hover:bg-slate-900/90 ${accentStyles[accent]}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-3xl bg-white/5 p-3 text-slate-100">{feature.icon}</div>
        <div className="rounded-full bg-white/5 px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-slate-300">Premium</div>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-100">{feature.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
    </motion.div>
  )
}
