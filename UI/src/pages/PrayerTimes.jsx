import { PrayerDashboard } from '../components/PrayerDashboard'

function PrayerTimes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <PrayerDashboard />
      </div>
    </div>
  )
}

export default PrayerTimes
