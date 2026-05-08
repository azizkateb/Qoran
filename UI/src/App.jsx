import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Clock4,
  Clock,
  BookOpen,
  Headphones,
  BookmarkPlus,
  Sparkles,
  MapPin,
  Bell,
  CalendarDays,
  ShieldCheck,
  Star,
  Moon,
  Shield,
  Globe2,
} from 'lucide-react'
import { SectionHeading } from './components/SectionHeading.jsx'
import { FeatureCard } from './components/FeatureCard.jsx'
import { PhoneShowcase } from './components/PhoneShowcase.jsx'
import { LanguageToggle } from './components/LanguageToggle.jsx'
import { DailyAyahCard } from './components/DailyAyahCard.jsx'
import { PrayerDashboard } from './components/PrayerDashboard'
import { AudioProvider } from './context/AudioContext.jsx'
import { AudioPlayer } from './components/AudioPlayer.jsx'
import { ShowPlayerButton } from './components/ShowPlayerButton.jsx'
import { AdhkarWidget } from './components/AdhkarWidget.jsx'

const QuranHome = lazy(() => import('./pages/QuranHome.jsx'))
const SurahReader = lazy(() => import('./pages/SurahReader.jsx'))
const PrayerTimes = lazy(() => import('./pages/PrayerTimes.jsx'))
const HaramLive = lazy(() => import('./pages/HaramLive.jsx'))
const AdhkarPage = lazy(() => import('./pages/AdhkarPage.jsx'))

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-slate-900/30">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
        <p className="text-sm text-slate-300">Loading content...</p>
      </div>
    </div>
  )
}

function Navbar() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 text-sm text-slate-300 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3 text-white">
          <div className="grid h-11 w-11 place-items-center rounded-3xl bg-white/10 shadow-glow backdrop-blur-xl ring-1 ring-white/10">
            <Sparkles className="h-5 w-5 text-amber-200" />
          </div>
          <div>
            <p className="font-semibold">{t('brand.name')}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('brand.tagline')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <nav className="flex flex-wrap items-center gap-4">
            <Link to="/" className="transition hover:text-emerald-300">{t('nav.home')}</Link>
            <Link to="/prayer-times" className="transition hover:text-emerald-300">{t('nav.prayerTimes')}</Link>
            <Link to="/live-haram" className="transition hover:text-emerald-300">{t('nav.liveHaram')}</Link>
            <Link to="/adhkar" className="transition hover:text-emerald-300">Adhkar</Link>
            <Link to="/quran" className="transition hover:text-emerald-300">{t('nav.quran')}</Link>
          </nav>
          <LanguageToggle />
        </div>
      </div>
    </header>
  )
}

const quranFeatures = [
  {
    titleKey: 'features.fullQuranReading',
    descriptionKey: 'features.fullQuranReadingDesc',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    titleKey: 'features.audioRecitation',
    descriptionKey: 'features.audioRecitationDesc',
    icon: <Headphones className="h-5 w-5" />,
  },
  {
    titleKey: 'features.bookmarkSurahs',
    descriptionKey: 'features.bookmarkSurahsDesc',
    icon: <BookmarkPlus className="h-5 w-5" />,
  },
  {
    titleKey: 'features.tafsirSupport',
    descriptionKey: 'features.tafsirSupportDesc',
    icon: <Shield className="h-5 w-5" />,
  },
]

const adhkarCards = [
  { titleKey: 'adhkar.morning', count: '12', accent: 'from-emerald-400/25 to-cyan-500/20' },
  { titleKey: 'adhkar.evening', count: '9', accent: 'from-indigo-400/25 to-violet-500/20' },
  { titleKey: 'adhkar.sleep', count: '5', accent: 'from-slate-400/20 to-slate-600/10' },
  { titleKey: 'adhkar.prayer', count: '7', accent: 'from-amber-400/20 to-orange-500/20' },
]

const premiumFeatures = [
  { titleKey: 'premiumFeatures.accuratePrayerTimes', icon: <Clock4 className="h-5 w-5" /> },
  { titleKey: 'premiumFeatures.qiblaDirection', icon: <MapPin className="h-5 w-5" /> },
  { titleKey: 'premiumFeatures.dailyNotifications', icon: <Bell className="h-5 w-5" /> },
  { titleKey: 'premiumFeatures.beautifulQuranReader', icon: <BookOpen className="h-5 w-5" /> },
  { titleKey: 'premiumFeatures.islamicCalendar', icon: <CalendarDays className="h-5 w-5" /> },
  { titleKey: 'premiumFeatures.offlineAccess', icon: <Globe2 className="h-5 w-5" /> },
]

function SunIcon() {
  return <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-400/10 text-amber-300 shadow-[0_12px_30px_rgba(248,205,86,0.16)]">☀️</div>
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay },
  }),
}

function HomePage() {
  const { t } = useTranslation()

  return (
    <main className="relative overflow-hidden bg-slate-950 text-slate-100 transition-all duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(126,211,255,0.18),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(249,209,91,0.12),transparent_20%),linear-gradient(180deg,#02101f_0%,#041b2c_50%,#071725_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_35%)]" />
      <div className="hero-stars">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <section className="grid gap-10 py-16 lg:grid-cols-[1.55fr_1fr] lg:items-center lg:gap-12">
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-200 shadow-glow">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(167,243,208,0.45)]" />
              {t('hero.badge')}
            </div>
            <div className="max-w-2xl space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-50 sm:text-6xl md:text-7xl">
                {t('hero.title')}
              </h1>
              <p className="text-lg leading-8 text-slate-300 sm:text-xl">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/quran" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                  {t('hero.readQuran')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/prayer-times" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-slate-100 transition hover:border-emerald-300 hover:text-emerald-200">
                  {t('hero.viewPrayerTimes')}
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.24)] backdrop-blur-2xl text-center"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="absolute -right-12 top-10 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute left-6 top-4 h-16 w-16 rounded-full bg-sky-300/10 blur-2xl" />
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-200">
                <Clock className="h-4 w-4" />
                {t('heroStats.title')}
              </div>
              <h2 className="text-2xl font-semibold text-slate-100">{t('heroStats.subtitle')}</h2>
              <p className="text-slate-300">
                {t('heroStats.description')}
              </p>
              <div className="flex justify-center">
                <div className="grid grid-cols-6 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl">🌅</div>
                    <div className="text-xs text-slate-400">{t('prayerNames.Fajr')}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl">☀️</div>
                    <div className="text-xs text-slate-400">{t('prayerNames.Sunrise')}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl">🌞</div>
                    <div className="text-xs text-slate-400">{t('prayerNames.Dhuhr')}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl">🌇</div>
                    <div className="text-xs text-slate-400">{t('prayerNames.Asr')}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl">🌆</div>
                    <div className="text-xs text-slate-400">{t('prayerNames.Maghrib')}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl">🌙</div>
                    <div className="text-xs text-slate-400">{t('prayerNames.Isha')}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="prayer-times" className="space-y-10 py-12">
          <SectionHeading
            label={t('sections.prayerTimesLabel')}
            title={t('sections.prayerTimesTitle')}
            description={t('sections.prayerTimesDesc')}
          />

          <div className="max-w-4xl mx-auto">
            <PrayerDashboard />
          </div>
        </section>

        <section id="ayah" className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-300/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-emerald-200">
                {t('ayahSection.reflectToday')}
              </div>
              <p className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
                {t('ayahSection.ayahVerse')}
              </p>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                {t('ayahSection.ayahQuote')}
              </p>
              <div className="h-[2px] w-28 rounded-full bg-gradient-to-r from-emerald-300/60 via-white/20 to-sky-300/50" />
            </div>
            <div className="flex justify-center">
              <DailyAyahCard showTitle={false} />
            </div>
          </div>
        </section>

        <section id="features" className="space-y-10 py-12">
          <SectionHeading
            label={t('sections.quranFeaturesLabel')}
            title={t('sections.quranFeaturesTitle')}
            description={t('sections.quranFeaturesDesc')}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quranFeatures.map((feature, index) => (
              <FeatureCard
                key={feature.titleKey}
                feature={{
                  ...feature,
                  title: t(feature.titleKey),
                  description: t(feature.descriptionKey),
                }}
                accent={index % 2 === 0 ? 'emerald' : 'amber'}
              />
            ))}
          </div>
        </section>

        <section className="space-y-10 py-12">
          <SectionHeading
            label={t('sections.adhkarLabel')}
            title={t('sections.adhkarTitle')}
            description={t('sections.adhkarDesc')}
          />
          <div className="max-w-2xl mx-auto">
            <AdhkarWidget />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.22)] backdrop-blur-2xl" id="download">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <SectionHeading
                label={t('sections.mobilePreviewLabel')}
                title={t('sections.mobilePreviewTitle')}
                description={t('sections.mobilePreviewDesc')}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {premiumFeatures.slice(0, 2).map((item) => (
                  <div key={item.titleKey} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-slate-200 shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
                    <div className="flex items-center gap-3 text-emerald-200">{item.icon}<span className="font-semibold">{t(item.titleKey)}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <PhoneShowcase />
          </div>
        </section>

        <section className="py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {premiumFeatures.slice(2).map((item) => (
              <div key={item.titleKey} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-slate-900/90">
                <div className="flex items-center gap-3 text-emerald-200">{item.icon}<span className="font-semibold">{t(item.titleKey)}</span></div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{t('sections.premiumDesc')}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 pt-8 text-slate-400">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-200/80">{t('brand.name')}</p>
              <p className="max-w-xl text-sm leading-6 text-slate-400">{t('brand.summary')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <a href="#prayer-times" className="transition hover:text-emerald-300">{t('nav.prayer')}</a>
              <a href="#ayah" className="transition hover:text-emerald-300">{t('nav.ayah')}</a>
              <a href="#features" className="transition hover:text-emerald-300">{t('nav.support')}</a>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>{t('footer.copyright')}</p>
            <p className="italic text-slate-400">{t('footer.remember')}</p>
          </div>
        </footer>
      </div>
    </main>
  )
}

function App() {
  return (
    <Router>
      <AudioProvider>
        <Navbar />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/live-haram" element={<HaramLive />} />
            <Route path="/adhkar" element={<AdhkarPage />} />
            <Route path="/quran" element={<QuranHome />} />
            <Route path="/quran/:surahId" element={<SurahReader />} />
            <Route path="/prayer-times" element={<PrayerTimes />} />
          </Routes>
        </Suspense>
        <AudioPlayer />
        <ShowPlayerButton />
      </AudioProvider>
    </Router>
  )
}

export default App
