import { useTranslation } from 'react-i18next'
import { Globe2 } from 'lucide-react'

export function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const current = i18n.resolvedLanguage || i18n.language || 'en'

  const languages = [
    { code: 'en', label: t('lang.en'), name: t('lang.english'), flag: '🇬🇧' },
    { code: 'ar', label: t('lang.ar'), name: t('lang.arabic'), flag: '🇸🇦' },
  ]

  const changeLanguage = (lng) => {
    if (lng === current) return
    i18n.changeLanguage(lng)
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 p-1 text-sm shadow-glow">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-slate-100">
        <Globe2 className="h-4 w-4 text-emerald-300" />
        <span className="hidden sm:inline">{t('lang.english')} / {t('lang.arabic')}</span>
      </div>
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => changeLanguage(lang.code)}
          className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
            current === lang.code
              ? 'bg-emerald-400 text-slate-950 shadow-glow'
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  )
}
