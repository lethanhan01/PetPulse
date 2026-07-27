import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const currentLang = i18n.resolvedLanguage || i18n.language || 'en';
  const isEnglish = currentLang.startsWith('en');

  const toggleLanguage = () => {
    const nextLang = isEnglish ? 'vi' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-9 h-9 rounded-full bg-background hover:bg-accent text-foreground transition-colors font-medium text-sm border border-border shrink-0"
      title="Switch Language"
    >
      {isEnglish ? 'EN' : 'VI'}
    </button>
  );
}
