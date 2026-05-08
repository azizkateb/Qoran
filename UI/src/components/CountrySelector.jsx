import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search, MapPin } from 'lucide-react'
import { countries } from '../data/prayerData'

export function CountrySelector({ selectedCountry, onCountryChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCountries, setFilteredCountries] = useState(countries)

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCountries(filtered)
  }, [searchTerm])

  const handleSelect = (country) => {
    onCountryChange(country)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Select Country
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
            <p className="text-sm text-slate-400">Country</p>
            <p className="text-slate-100 font-medium">
              {selectedCountry ? selectedCountry.name : 'Choose a country'}
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
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20"
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <motion.button
                  key={country.code}
                  whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-3 text-left text-slate-100 hover:bg-emerald-400/10 transition-colors duration-200 flex items-center gap-3"
                >
                  <div className="w-6 h-4 rounded-sm bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {country.code}
                  </div>
                  <span className="font-medium">{country.name}</span>
                </motion.button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-slate-400">
                No countries found
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
