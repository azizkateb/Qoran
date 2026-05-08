import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, RefreshCw, Loader2 } from 'lucide-react'
import { CountrySelector } from './CountrySelector'
import { CitySelector } from './CitySelector'
import { PrayerTimesCard } from './PrayerTimesCard'
import { PrayerCountdownWidget } from './PrayerCountdownWidget.jsx'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import {
  countries,
  LOCATION_PREFERENCES_KEY
} from '../data/prayerData'

export function PrayerDashboard() {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedCity, setSelectedCity] = useState('')
  const [isAutoDetecting, setIsAutoDetecting] = useState(false)
  const [useLocationAlways, setUseLocationAlways] = useState(false)
  const { prayerTimes, loading, error, lastUpdated, refresh } = usePrayerTimes(selectedCountry, selectedCity)

  const handleCountryChange = (country) => {
    setSelectedCountry(country)
    setSelectedCity('')
  }

  // Load saved preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_PREFERENCES_KEY)
    if (saved) {
      try {
        const { country, city, autoDetect } = JSON.parse(saved)
        if (autoDetect) {
          setUseLocationAlways(true)
        }
        if (country) setSelectedCountry(country)
        if (city) setSelectedCity(city)
      } catch (err) {
        
      }
    }
  }, [])

  // Auto-detect location on first load if no preferences or if always-use-location was enabled
  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_PREFERENCES_KEY)
    if (saved) {
      try {
        const { autoDetect } = JSON.parse(saved)
        if (autoDetect && !selectedCountry && !isAutoDetecting) {
          handleAutoDetectLocation()
        }
      } catch (err) {
        
      }
    } else if (!selectedCountry && !isAutoDetecting) {
      handleAutoDetectLocation()
    }
  }, [selectedCountry, isAutoDetecting])

  const handleAutoDetectLocation = async () => {
    setIsAutoDetecting(true)

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported')
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        })
      })

      const { latitude, longitude } = position.coords

      // Get location details from coordinates
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )

      if (!response.ok) {
        throw new Error('Failed to get location details')
      }

      const locationData = await response.json()
      const countryName = locationData.countryName
      const cityName = locationData.city || locationData.locality || locationData.principalSubdivision

      // Find country in our list
      const country = countries.find(c =>
        c.name.toLowerCase() === countryName.toLowerCase()
      )

      if (country && cityName) {
        // Find closest city match
        const city = country.cities.find(c =>
          c.toLowerCase().includes(cityName.toLowerCase()) ||
          cityName.toLowerCase().includes(c.toLowerCase())
        ) || cityName

        setSelectedCountry(country)
        setSelectedCity(city)
      }
    } catch (err) {
      
      // Silently fail - user can manually select
    } finally {
      setIsAutoDetecting(false)
    }
  }

  const handleUseLocationAlways = () => {
    localStorage.setItem(LOCATION_PREFERENCES_KEY, JSON.stringify({ autoDetect: true }))
    setUseLocationAlways(true)
    handleAutoDetectLocation()
  }

  const formatLastUpdated = (date) => {
    if (!date) return ''
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-200">
          <Clock className="h-4 w-4" />
          Prayer Times
        </div>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          Accurate Prayer Times Worldwide
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Select your location to get precise prayer times calculated using Islamic methods
        </p>
      </motion.div>

      {/* Location Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <CountrySelector
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          disabled={loading}
        />
        <CitySelector
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          disabled={loading || !selectedCountry}
        />
      </motion.div>

      {/* Auto-detect Location Button */}
      {!isAutoDetecting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={handleAutoDetectLocation}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-slate-100 transition hover:border-emerald-300 hover:text-emerald-200"
            >
              <MapPin className="h-4 w-4" />
              Use My Location
            </button>
            <button
              onClick={handleUseLocationAlways}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              <MapPin className="h-4 w-4" />
              Use My Location Always
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isAutoDetecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/50 px-6 py-3">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
            <span className="text-slate-300">Detecting your location...</span>
          </div>
        </motion.div>
      )}

      {/* Prayer Times Display */}
      {(selectedCountry && selectedCity) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Location Info & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Location</p>
                <p className="text-slate-100 font-medium">
                  {selectedCity}, {selectedCountry.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-slate-400">
                  Updated {formatLastUpdated(lastUpdated)}
                </span>
              )}
              <button
                onClick={refresh}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-center">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {prayerTimes && (
            <PrayerCountdownWidget timings={prayerTimes} onMidnightRefresh={refresh} />
          )}

          {/* Prayer Times Cards */}
          <PrayerTimesCard
            prayerTimes={prayerTimes}
            loading={loading}
          />
        </motion.div>
      )}
    </div>
  )
}
