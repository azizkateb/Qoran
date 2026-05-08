import quranData from './data/quran.json'

const STORAGE_KEY = 'dailyAyah'

export const getDailyAyah = () => {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  // Check localStorage
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed.date === today) {
      return parsed.ayah
    }
  }

  // Generate new ayah
  const newAyah = generateRandomAyah()
  const data = {
    date: today,
    ayah: newAyah
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return newAyah
}

const generateRandomAyah = () => {
  let attempts = 0
  const maxAttempts = 50

  while (attempts < maxAttempts) {
    // Pick random surah
    const randomSurah = quranData[Math.floor(Math.random() * quranData.length)]

    // Pick random ayah from the surah
    const randomAyah = randomSurah.ayahs[Math.floor(Math.random() * randomSurah.ayahs.length)]

    // Skip very short ayahs (less than 10 characters)
    if (randomAyah.text.length >= 10) {
      return {
        text: randomAyah.text,
        surah: randomSurah.surahNameEnglish,
        number: randomAyah.number
      }
    }
    attempts++
  }

  // Fallback: return first ayah of first surah if no suitable ayah found
  return {
    text: quranData[0].ayahs[0].text,
    surah: quranData[0].surahNameEnglish,
    number: quranData[0].ayahs[0].number
  }
}
