import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search, MapPin } from 'lucide-react'

export function CitySelector({ selectedCountry, selectedCity, onCityChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCities, setFilteredCities] = useState([])

  useEffect(() => {
    if (selectedCountry?.cities) {
      const filtered = selectedCountry.cities.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCities(filtered)
    } else {
      setFilteredCities([])
    }
  }, [selectedCountry, searchTerm])

  const handleSelect = (city) => {
    onCityChange(city)
    setIsOpen(false)
    setSearchTerm('')
  }

  if (!selectedCountry) {
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Select City
        </label>
        <div className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-700/50 bg-slate-950/50 backdrop-blur-xl cursor-not-allowed opacity-50">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-700/50 text-slate-500">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-slate-500">City</p>
              <p className="text-slate-400">Select a country first</p>
            </div>
          </div>
          <ChevronDown className="h-5 w-5 text-slate-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Select City
      </label>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-4 rounded-2xl border bg-slate-950/80 backdrop-blur-xl transition-all duration-300 ${
          disabled
            ? 'border-slate-700/50 cursor-not-allowed opacity-50'
            : 'border-white/10 hover:border-emerald-400/30 hover:bg-slate-900/95 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm text-slate-400">City</p>
            <p className="text-slate-100 font-medium">
              {selectedCity || 'Choose a city'}
            </p>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full mt-2 w-full max-h-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl z-50"
        >
          {/* Search Input */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20"
              />
            </div>
          </div>

          {/* Cities List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <motion.button
                  key={`${city}-${index}`}
                  whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                  onClick={() => handleSelect(city)}
                  className="w-full px-4 py-3 text-left text-slate-100 hover:bg-emerald-400/10 transition-colors duration-200 flex items-center gap-3"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-700/50 text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{city}</span>
                </motion.button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-slate-400">
                No cities found
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
