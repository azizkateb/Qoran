import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { adhkarData } from '../data/adhkarData'
import { AdhkarCard } from './AdhkarCard'
import { AdhkarProgressHeader } from './AdhkarProgressHeader'
import { CompletionCelebration } from './CompletionCelebration'
import { AchievementBadges } from './AchievementBadges'
import { useAdhkarProgress } from '../hooks/useAdhkarProgress'

export function AdhkarSection() {
  const [repeatCounts, setRepeatCounts] = useState({})
  const [showCelebration, setShowCelebration] = useState(false)
  const [previousComplete, setPreviousComplete] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('adhkar_theme') || 'dark')

  const adhkarType = useMemo(() => {
    const timeOfDay = new Date().getHours()
    return timeOfDay < 12 ? 'morning' : 'evening'
  }, [])

  const { completedAdhkar, totalXP, streak, currentLevel, toggleAdhkar, completeDay } =
    useAdhkarProgress(adhkarType)

  const currentAdhkar = useMemo(() => adhkarData[adhkarType], [adhkarType])
  const completedCount = useMemo(() => Object.keys(completedAdhkar).length, [completedAdhkar])
  const totalCount = useMemo(() => currentAdhkar.length, [currentAdhkar])

  // Calculate XP for current type
  const currentTypeXP = useMemo(() => {
    return Object.entries(completedAdhkar).reduce((acc, [id, isComplete]) => {
      if (isComplete) {
        const adhkar = currentAdhkar.find((a) => a.id === parseInt(id))
        return acc + (adhkar?.xp || 0)
      }
      return acc
    }, 0)
  }, [completedAdhkar, currentAdhkar])

  // Initialize repeat counts for uncompleted adhkar
  useEffect(() => {
    const initial = {}
    currentAdhkar.forEach((adhkar) => {
      initial[adhkar.id] = 0
    })
    setRepeatCounts(initial)
  }, [adhkarType])

  // Handle completion celebration
  useEffect(() => {
    const allCompleted = completedCount === totalCount && totalCount > 0
    if (allCompleted && !previousComplete) {
      setShowCelebration(true)
      completeDay(totalCount)
      setPreviousComplete(true)
    } else if (!allCompleted) {
      setPreviousComplete(false)
    }
  }, [completedCount, totalCount, previousComplete, completeDay])

  const handleAdhkarToggle = (adhkarId) => {
    const adhkar = currentAdhkar.find((a) => a.id === adhkarId)
    if (repeatCounts[adhkarId] >= adhkar.repeat) {
      toggleAdhkar(adhkarId, adhkar.xp)
      if (completedAdhkar[adhkarId]) {
        setRepeatCounts((prev) => ({ ...prev, [adhkarId]: 0 }))
      }
    }
  }

  const handleRepeatChange = (adhkarId, newCount) => {
    setRepeatCounts((prev) => ({ ...prev, [adhkarId]: newCount }))
    const adhkar = currentAdhkar.find((a) => a.id === adhkarId)
    if (newCount >= adhkar.repeat && !completedAdhkar[adhkarId]) {
      toggleAdhkar(adhkarId, adhkar.xp)
    }
  }

  useEffect(() => {
    localStorage.setItem('adhkar_theme', theme)
  }, [theme])

  const isLightTheme = theme === 'light'
  const sectionBase = isLightTheme
    ? 'bg-slate-100 text-slate-950'
    : 'bg-slate-950 text-slate-100'

  return (
    <section className={`relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${sectionBase}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl" />
        <div className="absolute bottom-40 left-20 h-80 w-80 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className={`rounded-[2rem] border ${isLightTheme ? 'border-slate-200 bg-white/90' : 'border-white/10 bg-slate-950/70'} p-6 shadow-[0_40px_100px_rgba(0,0,0,0.25)] backdrop-blur-2xl`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`text-sm uppercase tracking-[0.35em] ${isLightTheme ? 'text-emerald-700/70' : 'text-emerald-300/80'}`}>{adhkarType === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}</p>
                <h1 className={`mt-2 text-4xl sm:text-5xl font-bold leading-tight ${isLightTheme ? 'text-slate-950' : 'text-slate-100'}`}>
                  رحلة العبادة اليوم
                </h1>
                <p className={`mt-3 max-w-2xl leading-relaxed ${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                  {adhkarType === 'morning'
                    ? 'ابدأ يومك بنور القرآن والذكر بما يملأ قلبك بالسكينة'
                    : 'اختم يومك بأذكار تحفظك وتُسكن روعك'}
                </p>
              </div>
              <div className={`rounded-[1.75rem] border ${isLightTheme ? 'border-emerald-300/25 bg-emerald-50' : 'border-emerald-400/10 bg-emerald-400/5'} p-5 text-center ${isLightTheme ? 'shadow-none' : 'shadow-glow'}`}>
                <p className={`text-xs uppercase tracking-[0.32em] ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>Today's Dhikr</p>
                <p className={`mt-3 text-2xl font-semibold ${isLightTheme ? 'text-emerald-700' : 'text-emerald-200'}`}>{completedCount}/{totalCount}</p>
                <p className={`mt-1 text-xs ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>أذكار مكتملة</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isLightTheme ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-950'} shadow-lg`}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? 'نهار' : 'ليل'} Theme
              </button>
            </div>
          </div>

          <AdhkarProgressHeader
            completed={completedCount}
            total={totalCount}
            streak={streak}
            level={currentLevel}
            totalXP={totalXP}
            theme={theme}
          />
        </motion.div>

        {/* Adhkar Cards */}
        <motion.div layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {currentAdhkar.map((adhkar, index) => (
              <motion.div
                key={adhkar.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <AdhkarCard
                  adhkar={adhkar}
                  isCompleted={!!completedAdhkar[adhkar.id]}
                  onToggle={() => handleAdhkarToggle(adhkar.id)}
                  onRepeatChange={(newCount) => handleRepeatChange(adhkar.id, newCount)}
                  currentRepeats={repeatCounts[adhkar.id] || 0}
                  theme={theme}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 rounded-2xl border border-white/10 bg-white/5"
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-6 text-center">🏆 إنجازاتك</h2>
          <AchievementBadges
            streak={streak}
            totalXP={totalXP}
            level={currentLevel}
            isCompletedToday={completedCount === totalCount && totalCount > 0}
          />
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-center"
        >
          <p className="text-slate-300 leading-relaxed">
            {completedCount === totalCount
              ? '✨ أنت قدوة لنفسك! استمر على هذا النهج الجميل'
              : `📖 أكمل أذكارك اليومية - قال الله تعالى: {إن الله مع الصابرين}`}
          </p>
        </motion.div>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <CompletionCelebration
            isVisible={showCelebration}
            onClose={() => setShowCelebration(false)}
            level={currentLevel}
            totalXP={currentTypeXP}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
