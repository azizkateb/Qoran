# 🎮 Gamified Adhkar System - Documentation

## Overview

A premium, gamified Islamic adhkar (remembrance) experience built with React, Vite, TailwindCSS, and Framer Motion. The system motivates users to complete their daily adhkar with engaging gamification mechanics while maintaining spiritual and respectful design.

---

## 🎯 Features

### 1. **Daily Progress Tracking**
- Visual progress percentage (e.g., "5/7 completed")
- Animated progress ring with smooth transitions
- Real-time completion counter
- Celebration animation when all adhkar are completed

### 2. **Gamification Mechanics**

#### XP System
- Each adhkar earns XP points (10-15 XP per adhkar)
- Total XP accumulates and stores in localStorage
- XP counter displayed in progress header

#### Level Progression
- Current level = `floor(totalXP / 100) + 1`
- Level progress bar shows progression to next level
- Visual level badge with star emoji

#### Streak System
- Counts consecutive days of completion
- Resets if a day is missed
- Fire emoji indicator (🔥)
- Persisted in localStorage

#### Repeat Counter
- Each adhkar has required repeats (1-3)
- Interactive +/- buttons for counting
- Smooth animated counter display
- Progress bar showing repeat completion
- Card glows when fully completed

### 3. **Visual Design**
- Elegant green/gold Islamic aesthetic
- Glassmorphism effects with backdrop blur
- Soft glowing shadows
- Animated gradients
- Responsive mobile-first design
- Time-based content (morning/evening adhkar)

### 4. **Achievements & Badges**
- 6 unlockable badges:
  - 🌱 **Starter** - Complete first adhkar
  - ⚔️ **Week Warrior** - 7-day streak
  - 👑 **Month Master** - 30-day streak
  - 💯 **Century** - 100+ total XP
  - 🚀 **Level 10** - Reach level 10
  - ✨ **Perfect Day** - Complete all adhkar in one day

### 5. **Celebration Experience**
- Confetti animation on completion
- Motivational Islamic messages (randomly displayed)
- XP and level earned display
- Auto-close after 5 seconds
- Manual close option

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AdhkarCard.jsx              # Individual adhkar with repeat counter
│   ├── AdhkarProgressHeader.jsx    # Progress, streak, level, XP display
│   ├── AdhkarSection.jsx           # Main adhkar page component
│   ├── AdhkarWidget.jsx            # Mini widget for home page
│   ├── AchievementBadges.jsx       # Achievement/badge display
│   └── CompletionCelebration.jsx   # Celebration modal
├── hooks/
│   └── useAdhkarProgress.js        # State management & localStorage
├── data/
│   └── adhkarData.js               # Adhkar content (morning/evening)
└── pages/
    └── AdhkarPage.jsx              # Full adhkar page
```

---

## 🚀 Getting Started

### Installation

The system is already integrated into the main app. No additional installation needed.

### Usage

1. **Navigate to Adhkar Page**
   - Click "Adhkar" in navigation menu
   - Or use `/adhkar` route

2. **Complete Adhkar**
   - Tap "+/-" buttons to count repeats
   - Required repeats for each adhkar displayed
   - Click checkmark to mark as complete
   - Watch progress update in real-time

3. **Track Progress**
   - View daily completion % at top
   - Monitor streak, level, and XP
   - Check achievement badges
   - Receive celebration on completion

4. **View on Home Page**
   - Adhkar widget shows current progress
   - Quick stats: Streak, Level, XP
   - Click to navigate to full adhkar page

---

## 💾 Data Storage

All data persists in localStorage:

```javascript
// Keys used:
- adhkar_progress_morning        // Completed adhkar IDs
- adhkar_progress_evening        // Completed adhkar IDs
- adhkar_xp_morning              // Total XP for morning
- adhkar_xp_evening              // Total XP for evening
- adhkar_streak_morning          // Current streak
- adhkar_streak_evening          // Current streak
- adhkar_last_completion_morning // Last completion timestamp
- adhkar_last_completion_evening // Last completion timestamp
```

---

## 🎨 Customization

### Add More Adhkar

Edit `src/data/adhkarData.js`:

```javascript
{
  id: 5,
  title: "Your Adhkar Title",
  text: "Arabic text here...",
  repeat: 3,        // Required repeats
  benefit: "Benefit description...",
  xp: 12            // XP reward
}
```

### Adjust XP Values

Modify `xp` field in adhkar data:
- Low impact adhkar: 10 XP
- Medium impact: 12 XP
- High impact: 15 XP

### Change Achievement Thresholds

Edit `src/components/AchievementBadges.jsx`:

```javascript
const BADGES = {
  WEEK_WARRIOR: { 
    minStreak: 7    // Change to desired number
  },
  // ...
}
```

### Customize Motivation Messages

Edit `src/components/CompletionCelebration.jsx`:

```javascript
const motivationalMessages = [
  "Your custom message here",
  // Add more messages
]
```

---

## 🔧 Hook Documentation

### `useAdhkarProgress(adhkarType)`

**Parameters:**
- `adhkarType` (string): `'morning'` or `'evening'`

**Returns:**
```javascript
{
  completedAdhkar,    // Object: { adhkarId: true }
  totalXP,            // Number: cumulative XP
  streak,             // Number: current streak
  currentLevel,       // Number: calculated level
  toggleAdhkar,       // Function: toggle adhkar completion
  completeDay,        // Function: mark day as complete
  resetDaily,         // Function: reset daily progress
}
```

**Usage:**
```javascript
const { completedAdhkar, totalXP, streak, currentLevel } = useAdhkarProgress('morning')
```

---

## 🎬 Animation Features

### Framer Motion Components

- **Progress bars**: Spring animation on width change
- **Cards**: Hover lift effect + smooth transitions
- **Celebration**: Scale + confetti particles
- **Repeat counter**: Smooth increment animation
- **Badges**: Pulse glow on earned badges

### Custom CSS Animations

- `animate-glow` - Soft glowing effect
- `animate-float` - Floating motion
- `animate-pulse-glow` - Pulsing glow effect

---

## 📱 Mobile Optimization

- Large tap targets (40px+ buttons)
- Responsive grid layouts
- Sticky progress header
- Touch-friendly repeat controls
- Smooth scrolling
- Optimized animations for low-end devices

---

## ♿ Accessibility

- ARIA labels where needed
- High contrast colors
- Clear visual hierarchy
- Keyboard navigation support
- Semantic HTML

---

## 🐛 Known Limitations

- Streak resets daily at midnight (local time)
- Data only persists on device (no cloud sync)
- XP and levels are per session/browser

---

## 🚀 Future Enhancements

- Cloud sync with Firebase
- Social sharing
- Leaderboards
- Custom adhkar creation
- Notification reminders
- Dark/light theme toggle
- Integration with prayer times
- Weekly/monthly challenges
- Adhkar analytics dashboard

---

## 📞 Support

For issues or improvements, refer to the component files or reach out to the development team.

---

## 📜 License

Part of the Qoran application. All rights reserved.

---

**Happy Adhkar! 🌙✨**
