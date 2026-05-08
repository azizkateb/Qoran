import { motion } from 'framer-motion'
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react'

export function PhoneShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="relative mx-auto max-w-[340px]"
    >
      <div className="absolute -left-8 top-10 h-20 w-20 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute -right-6 bottom-10 h-24 w-24 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="rounded-[3rem] border border-white/10 bg-slate-950/90 p-5 shadow-[0_40px_120px_rgba(0,0,0,0.24)]">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 shadow-[inset_0_0_50px_rgba(255,255,255,0.04)]">
          <div className="absolute right-5 top-5 h-12 w-12 rounded-full bg-emerald-400/10 blur-xl" />
          <div className="flex items-center justify-between rounded-3xl bg-white/5 px-3 py-3 text-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Qibla</p>
              <p className="text-sm font-semibold text-slate-100">Mecca</p>
            </div>
            <span className="rounded-3xl bg-emerald-300/10 px-3 py-2 text-emerald-200">Live</span>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Quran Reader</p>
                <p className="mt-2 text-xl font-semibold text-slate-100">Al-Fatiha</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-emerald-300/10 text-emerald-200">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 space-y-3 text-slate-400">
              <p className="text-base leading-7">
                "Guide us to the straight path — the path of those upon whom You have bestowed favor."
              </p>
              <div className="flex items-center justify-between rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                <span>Surah progress</span>
                <span className="font-semibold text-slate-100">4/7</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-3xl bg-white/5 px-4 py-4 text-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
            <div className="inline-flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-emerald-200" />
              <span className="text-sm">Quiet reading mode</span>
            </div>
            <ArrowRight className="h-5 w-5 text-emerald-200" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
