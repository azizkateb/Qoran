import { motion } from 'framer-motion'

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.2)]"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-800" />
          <div className="h-4 w-20 rounded bg-slate-800" />
        </div>
        <div className="space-y-2">
          <div className="h-8 rounded bg-slate-800" />
          <div className="h-4 w-32 rounded bg-slate-800" />
        </div>
      </div>
    </motion.div>
  )
}
