import { useState, useEffect } from 'react'
import { getDailyAyah } from './ayahService'

export const useDailyAyah = () => {
  const [ayah, setAyah] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAyah = () => {
      const dailyAyah = getDailyAyah()
      setAyah(dailyAyah)
      setLoading(false)
    }

    loadAyah()
  }, [])

  return { ayah, loading }
}
