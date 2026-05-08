import { motion } from 'framer-motion'

export function AyahText({ ayah, index, isHighlighted }) {
  // Handle both API and local data structures
  const text = ayah.text || ayah.content || ''
  const ayahNumber = ayah.number || index + 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`space-y-3 rounded-2xl p-6 transition duration-300 ${
        isHighlighted ? 'border border-emerald-300/20 bg-emerald-400/5' : 'border border-white/5 bg-white/2'
      }`}
    >
      <p
        className="text-right text-2xl leading-loose text-slate-100 sm:text-3xl"
        style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif", lineHeight: '2.2' }}
        dir="rtl"
      >
        {text}
      </p>

      <div className="flex items-center justify-between pt-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-500/10 text-xs font-semibold text-emerald-200">
          {ayahNumber}
        </span>
        <span className="text-xs text-slate-500">آية {ayahNumber}</span>
      </div>
    </motion.div>
  )
}
