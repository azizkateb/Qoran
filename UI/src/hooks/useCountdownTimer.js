import { useEffect, useState } from 'react'

const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

const pad = (value) => String(value).padStart(2, '0')

const toDate = (timeString, dayOffset = 0) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  if (dayOffset) {
    date.setDate(date.getDate() + dayOffset)
  }
  return date
}

const formatCountdown = (seconds) => {
  if (seconds <= 0) {
    return '00:00:00'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}

const computePrayerStatus = (timings) => {
  const now = new Date()
  const dateKey = now.toISOString().split('T')[0]

  const prayerTimes = prayerOrder.map((name) => ({
    name,
    time: timings[name],
    date: toDate(timings[name]),
  }))

  let nextPrayer = null
  let currentPrayer = null
  let countdownTarget = null

  if (now < prayerTimes[0].date) {
    nextPrayer = prayerTimes[0]
    currentPrayer = null
    countdownTarget = prayerTimes[0].date
  } else {
    for (let i = 0; i < prayerTimes.length; i += 1) {
      const prayer = prayerTimes[i]
      const next = prayerTimes[i + 1]

      if (now >= prayer.date && (!next || now < next.date)) {
        currentPrayer = prayer
        if (next) {
          nextPrayer = next
          countdownTarget = next.date
        } else {
          nextPrayer = { name: 'Fajr', time: timings.Fajr, date: toDate(timings.Fajr, 1) }
          countdownTarget = nextPrayer.date
        }
        break
      }
    }
  }

  if (!nextPrayer) {
    nextPrayer = { name: 'Fajr', time: timings.Fajr, date: toDate(timings.Fajr, 1) }
    countdownTarget = nextPrayer.date
  }

  const secondsLeft = Math.max(0, Math.floor((countdownTarget - now) / 1000))

  return {
    currentPrayer: currentPrayer?.name || null,
    nextPrayer: nextPrayer.name,
    countdown: formatCountdown(secondsLeft),
    secondsLeft,
  }
}

export const useCountdownTimer = (timings, onMidnightRefresh) => {
  const [state, setState] = useState({
    currentPrayer: null,
    nextPrayer: null,
    countdown: '00:00:00',
    secondsLeft: 0,
  })

  useEffect(() => {
    if (!timings) {
      return undefined
    }

    let lastDate = new Date().toISOString().split('T')[0]

    const tick = () => {
      const nowKey = new Date().toISOString().split('T')[0]
      if (nowKey !== lastDate) {
        lastDate = nowKey
        if (onMidnightRefresh) {
          onMidnightRefresh()
        }
      }

      setState(computePrayerStatus(timings))
    }

    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [timings, onMidnightRefresh])

  return state
}
