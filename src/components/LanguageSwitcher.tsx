import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' }
  ];

  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
      <Languages size={16} className="text-slate-400 ml-2" />
      <div className="flex gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-bold transition-all",
              i18n.language === lang.code
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
