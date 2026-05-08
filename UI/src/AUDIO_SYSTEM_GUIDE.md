# 🎧 Audio Quran System - Complete Guide

## Overview

This is a production-quality Quran audio playback system built with React, Framer Motion, and Tailwind CSS. It provides a smooth, responsive experience for listening to Quranic recitations with modern UI/UX.

## Architecture

### Core Components

```
AudioProvider (Context)
    ↓
    ├── AudioPlayer (Floating UI)
    ├── ReciterSelector (Dropdown)
    ├── AyahItemAudio (Individual Ayah)
    └── useAudioManager (Custom Hooks)
```

### Data Flow

```
App.jsx
  ├── AudioProvider (wraps entire app)
  │   ├── SurahReader (loads surah audio)
  │   │   ├── useQuranAudio hook
  │   │   ├── fetchSurahAudio (service)
  │   │   └── AyahItemAudio components
  │   │
  │   ├── AudioPlayer (floating bottom player)
  │   │   ├── useAudioPlayback hook
  │   │   └── ReciterSelector dropdown
  │   │
  │   └── AudioContext State
  │       ├── currentSurah
  │       ├── currentAyah
  │       ├── isPlaying
  │       └── audioRef (HTML audio element)
```

## State Management

### AudioContext Structure

```javascript
{
  // Playback State
  isPlaying: boolean,
  currentSurah: { number, name, ayahs[], ... },
  currentAyah: { number, text, audio, ... },
  currentAyahIndex: number,
  currentReciter: 'ar.alafasy' | 'ar.abdulbasit' | ...,
  
  // Player State
  isBuffering: boolean,
  currentTime: number (seconds),
  duration: number (seconds),
  volume: 0-1,
  playbackSpeed: 0.75 | 1 | 1.25,
  
  // UI State
  isPlayerVisible: boolean,
  errorMessage: string | null,
  
  // Cache
  cachedAyahs: { surahId: ayahs[] }
}
```

## Usage Examples

### 1. Load a Surah with Audio

```javascript
import { useQuranAudio } from '@/hooks/useAudioManager'
import { useAudio } from '@/context/AudioContext'

function MyComponent() {
  const { loadSurah } = useQuranAudio()
  const audio = useAudio()
  
  useEffect(() => {
    // Load Surah Al-Fatiha (surah 1) with Mishary Alafasy
    loadSurah(1, 'ar.alafasy')
  }, [])
  
  return (
    <div>
      <h1>{audio.currentSurah?.name}</h1>
      <button onClick={() => audio.setPlaying(true)}>
        Play
      </button>
    </div>
  )
}
```

### 2. Play Specific Ayah

```javascript
function AyahClickHandler() {
  const { playAyah } = useQuranAudio()
  const { play } = useAudioPlayback()
  
  const handleAyahClick = async (ayahNumber) => {
    await playAyah(ayahNumber)
    await play()
  }
  
  return (
    <button onClick={() => handleAyahClick(5)}>
      Play Ayah 5
    </button>
  )
}
```

### 3. Navigate Between Ayahs

```javascript
function Navigation() {
  const audio = useAudio()
  
  return (
    <>
      <button onClick={() => audio.prevAyah()}>Previous</button>
      <button onClick={() => audio.nextAyah()}>Next</button>
    </>
  )
}
```

### 4. Change Reciter

```javascript
function ReciterControl() {
  const { changeReciter } = useQuranAudio()
  
  const handleReciterChange = async (reciterId) => {
    await changeReciter(reciterId)
  }
  
  return (
    <select onChange={(e) => handleReciterChange(e.target.value)}>
      <option value="ar.alafasy">Mishary Alafasy</option>
      <option value="ar.abdulbasit">Abdul Basit</option>
      <option value="ar.husary">Husary</option>
      <option value="ar.minshawi">Minshawi</option>
    </select>
  )
}
```

### 5. Monitor Playback Progress

```javascript
function ProgressBar() {
  const progress = usePlaybackProgress()
  const audio = useAudio()
  
  return (
    <div>
      <div className="w-full h-1 bg-gray-300">
        <div 
          className="h-full bg-emerald-400"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      <p>{progress.current} / {progress.duration}</p>
    </div>
  )
}
```

## API Reference

### useAudioPlayback()

Controls basic audio playback.

```javascript
const { play, pause, seekTo, stop } = useAudioPlayback()

play()           // Start playing
pause()          // Pause playback
seekTo(30)       // Seek to 30 seconds
stop()           // Stop and reset
```

### useQuranAudio()

Manages Quran-specific operations.

```javascript
const { 
  loadSurah,          // Load surah with audio
  playAyah,           // Play specific ayah
  playNextAyah,       // Play next ayah
  playPreviousAyah,   // Play previous ayah
  changeReciter       // Change reciter
} = useQuranAudio()

// Load surah 5 with reciter
await loadSurah(5, 'ar.alafasy')

// Play ayah 3 of current surah
await playAyah(3)

// Navigate
await playNextAyah()
await playPreviousAyah()

// Change reciter
await changeReciter('ar.husary')
```

### usePlaybackProgress()

Track playback progress.

```javascript
const { current, duration, percentage } = usePlaybackProgress()

// current: "1:23" (formatted time)
// duration: "45:30"
// percentage: 15.5 (0-100)
```

### useAutoScrollAyah()

Auto-scroll to current playing ayah.

```javascript
const currentAyahRef = useAutoScrollAyah()

return (
  <div ref={currentAyahRef}>
    {/* Current ayah element */}
  </div>
)
```

### quranAudioService

Direct API access for fetching Quranic data.

```javascript
import { 
  fetchSurahAudio,
  fetchAllSurahs,
  getAyahAudioUrl,
  getAllReciters,
  RECITERS
} from '@/services/quranAudioService'

// Fetch surah with audio
const surah = await fetchSurahAudio(1, 'ar.alafasy')

// Get all surahs metadata
const allSurahs = await fetchAllSurahs()

// Get audio URL for specific ayah
const audioUrl = await getAyahAudioUrl(1, 1, 'ar.alafasy')

// Get available reciters
const reciters = getAllReciters()
// {
//   'ar.alafasy': { name: 'Mishary Alafasy', nameAr: '...' },
//   ...
// }
```

## Supported Reciters

1. **Mishary Alafasy** (`ar.alafasy`)
   - Clear, melodious recitation
   - Recommended for learning

2. **Abdul Basit Abdus Samad** (`ar.abdulbasit`)
   - Traditional, authoritative
   - Excellent for tajweed

3. **Husary** (`ar.husary`)
   - Fast-paced recitation
   - Good for advanced listeners

4. **Muhammad Siddiq al-Minshawi** (`ar.minshawi`)
   - Emotional, beautiful recitation
   - Suitable for reflection

## Performance Optimizations

### 1. Lazy Loading
- Audio URLs are fetched only when needed
- Single ayah audio loads progressively

### 2. Caching Strategy
- Surah data cached for 24 hours
- localStorage key: `quran_surah_[number]_[reciter]`
- Automatic cache invalidation when reciter changes

### 3. Component Memoization
- AudioPlayer components are optimized with motion animations
- Callbacks are memoized to prevent unnecessary re-renders

### 4. Audio Element Reuse
- Single audio element reference shared via context
- Efficient resource management

## Error Handling

### Network Errors

```javascript
try {
  await loadSurah(1, 'ar.alafasy')
} catch (error) {
  console.error('Failed to load surah:', error.message)
  audio.setError('Network error. Please check your connection.')
}
```

### Audio Playback Errors

The audio element automatically handles:
- Failed audio loads
- Buffering issues
- Format unsupported errors

Errors are displayed in the player with user-friendly messages.

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome

## Offline Support

- ✅ Surah metadata cached
- ✅ Audio URLs cached
- ❌ Audio files not cached (requires streaming)

To enable offline audio:
1. Implement service worker for audio caching
2. Use localStorage for larger audio files
3. Consider IndexedDB for better performance

## Future Enhancements

### Planned Features

1. **Bookmarking System**
   - Save favorite ayahs
   - Create personal collections

2. **Sleep Timer**
   - Auto-stop after X minutes
   - Fade out effect

3. **Continue from Last Position**
   - Remember last played ayah
   - Resume functionality

4. **Tafsir Integration**
   - Show translations alongside Arabic
   - Multiple tafsir sources

5. **Sharing**
   - Share specific ayahs
   - Social media integration

6. **Custom Playlists**
   - Create themed lists
   - Daily recitation schedule

7. **Advanced Search**
   - Search by keyword
   - Filter by revelation type
   - Find ayahs with specific themes

## Troubleshooting

### Audio not playing?
1. Check browser audio permissions
2. Verify internet connection
3. Try different reciter
4. Check browser console for errors

### Slow loading?
1. Clear localStorage cache
2. Check network speed
3. Try different reciter (different CDN)

### Player not visible?
1. Check if `isPlayerVisible` is true
2. Navigate to SurahReader page
3. Verify AudioProvider wraps app

## Development Tips

### Debugging Audio State

```javascript
const audio = useAudio()

useEffect(() => {
  console.log('Audio State:', {
    currentSurah: audio.currentSurah?.name,
    currentAyah: audio.currentAyah?.numberInSurah,
    isPlaying: audio.isPlaying,
    time: audio.currentTime,
    duration: audio.duration,
  })
}, [audio])
```

### Adding New Reciter

1. Add to `RECITERS` in `quranAudioService.js`
2. Update reciter selector dropdown
3. Test with `fetchSurahAudio`

```javascript
// In quranAudioService.js
export const RECITERS = {
  'ar.mynewreciter': { 
    name: 'New Reciter Name', 
    nameAr: 'اسم القارئ' 
  },
  // ... existing reciters
}
```

### Customizing Player UI

The AudioPlayer component uses Framer Motion for animations:
```javascript
// Modify animations in AudioPlayer.jsx
<motion.div
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  // Custom animation properties
/>
```

## License & Attribution

- Audio files from: [Alquran.cloud API](https://alquran.cloud)
- UI Framework: React 19
- Styling: Tailwind CSS
- Animations: Framer Motion
- Icons: Lucide React

## Support

For issues or questions:
1. Check this guide
2. Review code comments
3. Check browser console for errors
4. Test with different reciter/surah

---

**Last Updated:** May 2026
**Version:** 1.0
**Status:** Production Ready ✅
