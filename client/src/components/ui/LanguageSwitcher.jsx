import { useTranslation } from 'react-i18next';
import api from '../../api';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = async () => {
        const nextLang = i18n.language === 'en' ? 'ru' : 'en';
        i18n.changeLanguage(nextLang);
        try { await api.patch('/users/me/language', { language: nextLang }); } catch (e) { }
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
