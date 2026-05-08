import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { HaramLivePlayer } from '../components/HaramLivePlayer'

function HaramLive() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-200">
            {t('liveHaram.badge')}
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-slate-50 sm:text-5xl">
              {t('liveHaram.title')}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              {t('liveHaram.description')}
            </p>
          </div>
          <HaramLivePlayer />
        </motion.div>
      </div>
    </main>
  )
}

export default HaramLive
