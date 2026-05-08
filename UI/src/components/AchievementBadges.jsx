import { motion } from 'framer-motion'

const BADGES = {
  STARTER: { icon: '🌱', label: 'Starter', description: 'Complete your first adhkar', minStreak: 0 },
  WEEK_WARRIOR: { icon: '⚔️', label: 'Week Warrior', description: '7-day streak', minStreak: 7 },
  MONTH_MASTER: { icon: '👑', label: 'Month Master', description: '30-day streak', minStreak: 30 },
  CENTURY: { icon: '💯', label: 'Century', description: '100 total XP', minXP: 100 },
  LEVEL_10: { icon: '🚀', label: 'Level 10', description: 'Reach Level 10', minLevel: 10 },
  PERFECT_DAY: { icon: '✨', label: 'Perfect Day', description: 'Complete all adhkar in one day', completedAll: true },
}

export function AchievementBadges({ streak, totalXP, level, isCompletedToday }) {
  const earnedBadges = []

  if (streak >= 1) earnedBadges.push('STARTER')
  if (streak >= 7) earnedBadges.push('WEEK_WARRIOR')
  if (streak >= 30) earnedBadges.push('MONTH_MASTER')
  if (totalXP >= 100) earnedBadges.push('CENTURY')
  if (level >= 10) earnedBadges.push('LEVEL_10')
  if (isCompletedToday) earnedBadges.push('PERFECT_DAY')

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {Object.entries(BADGES).map(([key, badge]) => {
        const isEarned = earnedBadges.includes(key)
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={isEarned ? { scale: 1.1 } : {}}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
              isEarned
                ? 'border-amber-400/50 bg-amber-400/10 shadow-lg shadow-amber-400/20'
                : 'border-white/10 bg-white/5 opacity-50'
            }`}
          >
            <div className={`text-3xl mb-2 ${isEarned ? 'animate-pulse-glow' : ''}`}>
              {badge.icon}
            </div>
            <p className="text-xs font-semibold text-slate-200 text-center">{badge.label}</p>
            <p className="text-[10px] text-slate-400 text-center mt-1">{badge.description}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
