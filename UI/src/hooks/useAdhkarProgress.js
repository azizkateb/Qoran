import { useState, useEffect, useCallback } from 'react'

export function useAdhkarProgress(adhkarType) {
  const storageKey = `adhkar_progress_${adhkarType}`
  const streakKey = `adhkar_streak_${adhkarType}`
  const xpKey = `adhkar_xp_${adhkarType}`
  const lastCompletionKey = `adhkar_last_completion_${adhkarType}`

  const [completedAdhkar, setCompletedAdhkar] = useState({})
  const [totalXP, setTotalXP] = useState(0)
  const [streak, setStreak] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    const savedXP = localStorage.getItem(xpKey)
    const savedStreak = localStorage.getItem(streakKey)
    const lastCompletion = localStorage.getItem(lastCompletionKey)

    if (saved) {
      setCompletedAdhkar(JSON.parse(saved))
    }
    if (savedXP) {
      const xp = Number(savedXP)
      setTotalXP(xp)
      setCurrentLevel(Math.floor(xp / 100) + 1)
    }
    if (savedStreak) {
      setStreak(Number(savedStreak))
    }

    if (lastCompletion) {
      const lastDate = new Date(lastCompletion).toDateString()
      const today = new Date().toDateString()
      if (lastDate !== today) {
        setCompletedAdhkar({})
      }
    }
  }, [storageKey, xpKey, streakKey, lastCompletionKey])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedAdhkar))
  }, [completedAdhkar, storageKey])

  useEffect(() => {
    localStorage.setItem(xpKey, String(totalXP))
    setCurrentLevel(Math.floor(totalXP / 100) + 1)
  }, [totalXP, xpKey])

  const toggleAdhkar = useCallback(
    (adhkarId, xpReward) => {
      setCompletedAdhkar((prev) => {
        const updated = { ...prev }
        if (updated[adhkarId]) {
          delete updated[adhkarId]
          setTotalXP((xp) => Math.max(0, xp - xpReward))
        } else {
          updated[adhkarId] = true
          setTotalXP((xp) => xp + xpReward)
        }
        return updated
      })
    },
    []
  )

  const completeDay = useCallback(() => {
    const todayISO = new Date().toISOString()
    const lastCompletion = localStorage.getItem(lastCompletionKey)
    const lastDate = lastCompletion ? new Date(lastCompletion).toDateString() : null
    const todayDate = new Date().toDateString()

    if (lastDate === todayDate) {
      return false
    }

    localStorage.setItem(lastCompletionKey, todayISO)

    setStreak((current) => {
      const nextStreak = lastDate === new Date(Date.now() - 86400000).toDateString() ? current + 1 : 1
      localStorage.setItem(streakKey, String(nextStreak))
      return nextStreak
    })

    return true
  }, [lastCompletionKey, streakKey])

  const resetDaily = useCallback(() => {
    setCompletedAdhkar({})
  }, [])

  return {
    completedAdhkar,
    totalXP,
    streak,
    currentLevel,
    toggleAdhkar,
    completeDay,
    resetDaily,
  }
}
