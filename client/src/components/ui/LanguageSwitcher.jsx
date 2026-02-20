import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'ru' : 'en';
        i18n.changeLanguage(nextLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-1 font-medium hover:text-blue-500 transition-colors uppercase"
        >
            {i18n.language}
        </button>
    );
}
