import { useCallback, useEffect, useState } from 'react'
import { PRAYER_TIMES_CACHE_KEY } from '../data/prayerData'

const getCacheKey = (countryName, cityName, dateKey) =>
  `${PRAYER_TIMES_CACHE_KEY}_${countryName}_${cityName}_${dateKey}`

export const usePrayerTimes = (selectedCountry, selectedCity) => {
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchPrayerTimes = useCallback(async () => {
    if (!selectedCountry || !selectedCity) {
      return
    }

    const dateKey = new Date().toISOString().split('T')[0]
    const cacheKey = getCacheKey(selectedCountry.name, selectedCity, dateKey)
    const cached = localStorage.getItem(cacheKey)

    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        setPrayerTimes(parsed.data)
        setLastUpdated(new Date(parsed.timestamp))
        return
      } catch (err) {
        
      }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(selectedCity)}&country=${encodeURIComponent(selectedCountry.name)}&method=5`
      )

      if (!response.ok) {
        throw new Error('Failed to load prayer times')
      }

      const result = await response.json()
      if (result.code !== 200 || !result.data || !result.data.timings) {
        throw new Error('Prayer times response invalid')
      }

      const timings = result.data.timings
      const cacheData = { data: timings, timestamp: Date.now() }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
      setPrayerTimes(timings)
      setLastUpdated(new Date())
    } catch (err) {
      
      setError('Unable to load prayer times. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [selectedCountry, selectedCity])

  useEffect(() => {
    fetchPrayerTimes()
  }, [fetchPrayerTimes])

  const refresh = useCallback(async () => {
    const dateKey = new Date().toISOString().split('T')[0]
    const cacheKey = getCacheKey(selectedCountry?.name, selectedCity, dateKey)
    localStorage.removeItem(cacheKey)
    await fetchPrayerTimes()
  }, [fetchPrayerTimes, selectedCountry, selectedCity])

  return { prayerTimes, loading, error, lastUpdated, refresh }
}
