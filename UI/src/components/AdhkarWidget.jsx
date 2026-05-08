import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { adhkarData } from '../data/adhkarData'
import { useAdhkarProgress } from '../hooks/useAdhkarProgress'

const timeOfDay = new Date().getHours()
const adhkarType = timeOfDay < 12 ? 'morning' : 'evening'

export function AdhkarWidget() {
  const { completedAdhkar, totalXP, streak, currentLevel } = useAdhkarProgress(adhkarType)
  
  const currentAdhkar = adhkarData[adhkarType]
  const completedCount = Object.keys(completedAdhkar).length
  const totalCount = currentAdhkar.length
  const progressPercentage = (completedCount / totalCount) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/10 via-slate-900/50 to-emerald-500/5 p-6 shadow-lg hover:border-emerald-400/30 transition cursor-pointer"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.15),transparent_60%)] opacity-0 group-hover:opacity-100 transition duration-300" />

      <Link to="/adhkar" className="relative block space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">
            {adhkarType === 'morning' ? '🌅 أذكار الصباح' : '🌙 أذكار المساء'}
          </h3>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-sm font-medium">
            {completedCount}/{totalCount}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="h-full bg-gradient-to-r from-emerald-400 to-green-400"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-sm font-bold text-emerald-300">{streak}</div>
            <div className="text-xs text-slate-400">🔥 Streak</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-sm font-bold text-amber-300">{currentLevel}</div>
            <div className="text-xs text-slate-400">⭐ Level</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-sm font-bold text-purple-300">{totalXP}</div>
            <div className="text-xs text-slate-400">⚡ XP</div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 text-center">
          <p className="text-xs text-slate-400 group-hover:text-emerald-300 transition">
            {completedCount === totalCount
              ? '✨ اكمل أذكارك المتبقية'
              : '👆 اضغط لإكمال أذكارك'}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
