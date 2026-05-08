import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

const motivationalMessages = [
  "ما أجمل هذا! أكمل يومك بروح مطمئنة",
  "بارك الله فيك في كل خطواتك",
  "تذكر: الاستمرار هو أفضل طريق للنجاح",
  "حفظك الله وحفظ أحبابك",
  "كل يوم خطوة نحو الأفضل",
  "أنت تبني عادة جميلة - استمر",
  "الله يقبل منك هذا العمل",
  "رحمة الله عليك في يومك",
]

export function CompletionCelebration({ isVisible, onClose, level, totalXP }) {
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      {/* Confetti effect */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            y: 300,
            x: Math.sin(i) * 200,
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 2.5, delay: Math.random() * 0.3 }}
          className="absolute h-3 w-3 rounded-full"
          style={{
            background: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b'][i % 4],
            left: `${Math.random() * 100}%`,
            top: '50%',
          }}
        />
      ))}

      {/* Celebration Card */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative rounded-[3rem] border-2 border-emerald-400/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl shadow-emerald-500/30 p-8 max-w-md mx-4 text-center"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-emerald-400/20 via-transparent to-green-400/20 blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Celebration emoji */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-7xl"
          >
            ✨
          </motion.div>

          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent mb-2">
              مبروك!
            </h2>
            <p className="text-emerald-200 font-semibold mb-4">
              اكتملت أذكارك اليومية
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
              {randomMessage}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <div className="text-2xl font-bold text-amber-400">+{totalXP}</div>
              <div className="text-xs text-slate-400">XP Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">Lvl {level}</div>
              <div className="text-xs text-slate-400">Current Level</div>
            </div>
          </div>

          {/* Progress indication */}
          <div className="text-xs text-slate-500">
            Click or wait to close
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
