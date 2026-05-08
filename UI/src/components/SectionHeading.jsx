import { motion } from 'framer-motion'

export function SectionHeading({ label, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.7 }}
      className="space-y-4"
    >
      <p className="text-xs uppercase tracking-[0.32em] text-emerald-300/80">{label}</p>
      <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-sm leading-7 text-slate-400 md:text-base">{description}</p>
    </motion.div>
  )
}
