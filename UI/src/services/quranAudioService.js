/**
 * Quran Audio Service
 * Handles fetching surah data and audio URLs from Alquran.cloud API
 */

const BASE_URL = 'https://api.alquran.cloud/v1'

// Supported reciters with their identifiers
export const RECITERS = {
  'ar.alafasy': { name: 'Mishary Alafasy', nameAr: 'مشاري العفاسي' },
  'ar.abdulbasit': { name: 'Abdul Basit Abdus Samad', nameAr: 'عبد الباسط عبد الصمد' },
  'ar.husary': { name: 'Husary', nameAr: 'الحصري' },
  'ar.minshawi': { name: 'Muhammad Siddiq al-Minshawi', nameAr: 'محمد صديق المنشاوي' },
}

/**
 * Fetch surah data with audio URLs
 * @param {number} surahNumber - The surah number (1-114)
 * @param {string} reciter - The reciter code (default: ar.alafasy)
 * @returns {Promise<Object>} Surah object with ayahs and audio URLs
 */
export async function fetchSurahAudio(surahNumber, reciter = 'ar.alafasy') {
  try {
    // Validate surah number
    if (surahNumber < 1 || surahNumber > 114) {
      throw new Error(`Invalid surah number: ${surahNumber}. Must be between 1 and 114.`)
    }

    // Check cache first
    const cacheKey = `quran_surah_${surahNumber}_${reciter}`
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
      
      return JSON.parse(cachedData)
    }

    

    // Fetch from API
    const response = await fetch(`${BASE_URL}/surah/${surahNumber}/${reciter}`)
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    if (!data.data) {
      throw new Error('Invalid API response structure')
    }

    const surah = data.data
    const formattedSurah = {
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType,
      ayahs: surah.ayahs.map((ayah) => ({
        number: ayah.number,
        text: ayah.text,
        numberInSurah: ayah.numberInSurah,
        audio: ayah.audio,
        audioSecondary: ayah.audioSecondary || [],
      })),
    }

    // Cache the data
    localStorage.setItem(cacheKey, JSON.stringify(formattedSurah))
    

    return formattedSurah
  } catch (error) {
    
    throw error
  }
}

/**
 * Fetch all surahs metadata (without audio)
 * @returns {Promise<Array>} Array of surah metadata
 */
export async function fetchAllSurahs() {
  try {
    const cacheKey = 'quran_all_surahs'
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
      
      return JSON.parse(cachedData)
    }

    
    const response = await fetch(`${BASE_URL}/quran/quran-uthmani`)
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    if (!data.data || !data.data.surahs) {
      throw new Error('Invalid API response structure')
    }

    const surahs = data.data.surahs.map((surah) => ({
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType,
    }))

    // Cache for 7 days
    localStorage.setItem(cacheKey, JSON.stringify(surahs))
    

    return surahs
  } catch (error) {
    
    throw error
  }
}

/**
 * Get audio URL for a specific ayah
 * @param {number} surahNumber - The surah number
 * @param {number} ayahNumber - The ayah number
 * @param {string} reciter - The reciter code
 * @returns {Promise<string>} Audio URL
 */
export async function getAyahAudioUrl(surahNumber, ayahNumber, reciter = 'ar.alafasy') {
  try {
    const surah = await fetchSurahAudio(surahNumber, reciter)
    const ayah = surah.ayahs.find((a) => a.numberInSurah === ayahNumber)
    
    if (!ayah || !ayah.audio) {
      throw new Error(`Audio not found for ayah ${surahNumber}:${ayahNumber}`)
    }

    return ayah.audio
  } catch (error) {
    
    throw error
  }
}

/**
 * Change reciter for a surah
 * @param {number} surahNumber - The surah number
 * @param {string} newReciter - The new reciter code
 * @returns {Promise<Object>} Updated surah data with new reciter
 */
export async function changeReciter(surahNumber, newReciter) {
  try {
    if (!RECITERS[newReciter]) {
      throw new Error(`Unknown reciter: ${newReciter}`)
    }

    // Clear previous reciter's cache for this surah
    const oldReciters = Object.keys(RECITERS)
    oldReciters.forEach((reciter) => {
      const cacheKey = `quran_surah_${surahNumber}_${reciter}`
      localStorage.removeItem(cacheKey)
    })

    // Fetch with new reciter
    return await fetchSurahAudio(surahNumber, newReciter)
  } catch (error) {
    
    throw error
  }
}

/**
 * Preload audio for smooth playback
 * @param {string} audioUrl - The audio URL to preload
 * @returns {Promise<void>}
 */
export async function preloadAudio(audioUrl) {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    audio.oncanplay = () => resolve()
    audio.onerror = () => reject(new Error('Failed to preload audio'))
    audio.src = audioUrl
  })
}

/**
 * Get reciter info
 * @param {string} reciterId - The reciter ID
 * @returns {Object} Reciter info or null
 */
export function getReciterInfo(reciterId) {
  return RECITERS[reciterId] || null
}

/**
 * Get all reciters
 * @returns {Object} All available reciters
 */
export function getAllReciters() {
  return RECITERS
}
