# 🎧 Audio Quran System - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION (App.jsx)                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AudioProvider (Context)                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Global State:                                             │  │
│  │ • currentSurah, currentAyah                              │  │
│  │ • isPlaying, currentTime, duration                       │  │
│  │ • volume, playbackSpeed                                 │  │
│  │ • currentReciter                                         │  │
│  │ • audioRef (HTML Audio Element)                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
        ↓                           ↓                        ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│  QuranHome Page  │  │ SurahReader Page │  │  Other Pages         │
│  • List Surahs   │  │ • Display Ayahs  │  │  • Prayer Times      │
│  • Search Filter │  │ • Load Audio     │  │  • Live Haram        │
└──────────────────┘  │ • Show Player    │  │  • Daily Ayah        │
        ↓             │ • Scroll Ayah    │  └──────────────────────┘
  SurahCard ×114      └──────────────────┘
                              ↓
                     ┌─────────────────────┐
                     │  AyahItemAudio ×N   │
                     │ • Play Button       │
                     │ • Highlight Active  │
                     │ • Show Text         │
                     │ • Click to Play     │
                     └─────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  AudioPlayer (Floating Bottom)                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Play/Pause │ ◄◄ ►► │ Volume │ Speed │ Reciter Selector │   │
│  │ Progress Bar        │        Time Display              │   │
│  └─────────────────────────────────────────────────────────┘   │
│          │                                                      │
│          ├──→ Calls useAudioPlayback() hooks                    │
│          └──→ Displays ReciterSelector dropdown                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User Action                Hook                Service              State
─────────────              ────                ───────              ────

Click Surah
    ↓
Navigate to /quran/:id
    ↓
useQuranAudio()  ──→  loadSurah()  ──→  fetchSurahAudio()  ──→  AudioContext
                                        (API call to                ↓
                                        Alquran.cloud)          setCurre ntSurah
                                             ↓                       ↓
                                        Cache to                  Store in
                                        localStorage            Context State
                                             ↓
                                        Return surah
                                        with audio URLs
                                             ↓
    ┌─────────────────────────────────────────┘
    ↓
Render AyahItemAudio
components with play buttons
    ↓
Click Ayah Play Button
    ↓
useQuranAudio()  ──→  playAyah()  ──→  audioRef.src = URL  ──→  HTML Audio
                                            ↓
                                        play()
                                            ↓
    ┌─────────────────────────────────────────┘
    ↓
Audio plays, emits events
    ↓
Event Listeners Update State
    ↓
AudioPlayer Re-renders with
progress, time, playback status
    ↓
User adjusts controls
(volume, speed, reciter)
    ↓
Callbacks Update Context
    ↓
HTML Audio Element Updates
```

## Component Hierarchy

```
App
├── Router
└── AudioProvider
    ├── Routes
    │   ├── HomePage
    │   ├── QuranHome
    │   │   ├── DailyAyahCard
    │   │   ├── SearchBar
    │   │   └── SurahCard (×114)
    │   │       └── onClick → navigate to SurahReader
    │   │
    │   ├── SurahReader
    │   │   ├── QuranHeader
    │   │   └── AyahItemAudio (×N)
    │   │       ├── Ayah Text
    │   │       ├── Play Button
    │   │       └── Metadata
    │   │
    │   ├── PrayerTimes
    │   ├── HaramLive
    │   └── OtherPages
    │
    └── AudioPlayer (Global)
        ├── PlayControls
        ├── ProgressBar
        ├── VolumeControl
        ├── SpeedSelector
        └── ReciterSelector
            └── ReciterOption (×4)
```

## State Flow Diagram

```
┌──────────────────────────────────────────────────┐
│           AUDIO CONTEXT STATE MACHINE            │
└──────────────────────────────────────────────────┘

Initial State
    ↓
User selects Surah
    ↓ (dispatch: SET_CURRENT_SURAH)
SurahSelectedState
    ├─ currentSurah: {name, ayahs[], ...}
    ├─ currentAyahIndex: 0
    ├─ isPlaying: false
    └─ isPlayerVisible: true
    ↓
User clicks Play
    ↓ (dispatch: SET_PLAYING)
PlayingState
    ├─ isPlaying: true
    ├─ isBuffering: true (initially)
    └─ currentTime: 0 (increments as audio plays)
    ↓
Audio loads & plays
    ↓ (dispatch: SET_DURATION, SET_BUFFERING)
Active PlaybackState
    ├─ duration: 123.45 seconds
    ├─ isBuffering: false
    ├─ currentTime: updates every ~100ms
    └─ currentAyah: {number, text, audio}
    ↓
User clicks Next
    ↓ (dispatch: NEXT_AYAH)
Next AyahState
    ├─ currentAyahIndex: 1
    ├─ currentAyah: ayahs[1]
    ├─ currentTime: 0 (reset)
    └─ audioRef.src: newAudioURL
    ↓
User changes reciter
    ↓ (dispatch: SET_RECITER)
ReciterChanged State
    ├─ currentReciter: 'ar.husary'
    ├─ isPlaying: false (reset)
    ├─ currentTime: 0
    └─ audioRef.src: '' (clear for reload)
    ↓
loadSurah() called again
    ↓
Back to SurahSelectedState (with new reciter)
```

## Hook Dependencies

```
useAudioPlayback()
    ↓
    Uses: useAudio(), useRef()
    Provides: play(), pause(), seekTo(), stop()
    Manages: HTML Audio element events
    
useQuranAudio()
    ↓
    Uses: useAudio(), useAudioPlayback(), useCallback()
    Provides: loadSurah(), playAyah(), playNextAyah(), changeReciter()
    Calls: fetchSurahAudio() from service
    
usePlaybackProgress()
    ↓
    Uses: useAudio(), useCallback()
    Provides: {current, duration, percentage}
    Calculates: Time formatting & percentage

useAutoScrollAyah()
    ↓
    Uses: useAudio(), useEffect(), useRef()
    Provides: ref for auto-scroll element
    Effect: Scrolls into view when ayah changes
```

## Service Functions

```
quranAudioService.js
    │
    ├── fetchSurahAudio(surahNumber, reciter)
    │   └─→ API: /surah/{number}/{reciter}
    │       Returns: {ayahs[], metadata, audioUrls}
    │       Caches: To localStorage
    │
    ├── fetchAllSurahs()
    │   └─→ API: /quran/quran-uthmani
    │       Returns: [{name, englishName, numberOfAyahs}, ...]
    │       Caches: For 7 days
    │
    ├── getAyahAudioUrl(surahNumber, ayahNumber, reciter)
    │   └─→ Extracts specific ayah audio URL
    │
    ├── changeReciter(surahNumber, newReciter)
    │   └─→ Clears old cache, fetches with new reciter
    │
    ├── preloadAudio(audioUrl)
    │   └─→ Pre-fetches audio for smooth playback
    │
    ├── RECITERS constant
    │   └─→ {ar.alafasy: {name, nameAr}, ...}
    │
    └── getAllReciters()
        └─→ Returns all available reciters
```

## API Integration Points

```
Alquran.cloud API
    │
    ├── /surah/{1-114}/ar.alafasy
    ├── /surah/{1-114}/ar.abdulbasit
    ├── /surah/{1-114}/ar.husary
    ├── /surah/{1-114}/ar.minshawi
    │
    └── /quran/quran-uthmani
        (metadata only)

Response Structure
    └── {
        data: {
            number: 1,
            name: "الفاتحة",
            englishName: "Al-Fatiha",
            numberOfAyahs: 7,
            revelationType: "Meccan",
            ayahs: [
                {
                    number: 1,
                    text: "الحمد لله رب العالمين",
                    numberInSurah: 1,
                    audio: "https://cdn.alquran.cloud/..."
                },
                ...
            ]
        }
    }
```

## Event Flow

```
User Interaction
    ↓
Event Handler
    ↓
Hook Callback
    ↓
Context Dispatch (reducer action)
    ↓
State Update
    ↓
Component Re-render
    ↓
HTML Audio API Update
    ↓
Audio Event Listener
    ↓
updateCurrentTime() → Dispatch SET_TIME
    ↓
Context State Updated
    ↓
Component Re-render
    ↓
UI Updates (progress bar, time display)
```

## Mobile Responsive Breakpoints

```
Mobile-First Approach

320px - 767px (Mobile)
    ├── 1-column grid
    ├── Full-width player
    ├── Compact controls
    └── Touch-friendly buttons

768px - 1024px (Tablet)
    ├── 2-column grid
    ├── Optimized player
    ├── Medium spacing
    └── Hybrid touch/mouse

1025px+ (Desktop)
    ├── 3-column grid
    ├── Full player UI
    ├── Full spacing
    └── All features visible
```

## Performance Optimization Path

```
User Loads /quran/1
    ↓
Check localStorage
    ├── Hit: Return cached data (500ms)
    └── Miss: Fetch from API (5s)
    ↓
Render AyahItemAudio components
    ├── Lazy render (only visible)
    └── Memoized callbacks
    ↓
User clicks Play
    ↓
audioRef.src = first ayah URL
    ├── Starts progressive streaming
    ├── Plays as it downloads
    └── No wait for full download
    ↓
Playback events update state
    ├── Every ~100ms (timeupdate)
    └── Memoized update callbacks
    ↓
Components update efficiently
    ├── Only affected components re-render
    └── Smooth 60fps animations
```

## Key Technology Stack

```
React 19
    └── Core rendering engine
    
Framer Motion 11
    └── Smooth animations & transitions
    
Tailwind CSS 3
    └── Responsive styling
    
Lucide Icons
    └── Beautiful SVG icons
    
i18next
    └── Internationalization (existing)
    
Web Audio API
    └── HTML <audio> element
    └── Event listeners
    └── Playback control
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Efficient state management  
✅ Responsive and mobile-friendly UI
✅ Smooth performance
✅ Easy to extend and maintain
✅ Production-ready code quality
