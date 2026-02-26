import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "login": "Login", "register": "Register", "logout": "Logout", "profile": "Profile",
      "search_placeholder": "Search inventories and items...", "my_dashboard": "My Dashboard",
      "create_new": "Create New", "owned_inventories": "Owned Inventories", "shared_with_me": "Shared with Me"
    }
  },
  ru: {
    translation: {
      "login": "Вход", "register": "Регистрация", "logout": "Выход", "profile": "Профиль",
      "search_placeholder": "Поиск инвентарей и предметов...", "my_dashboard": "Панель управления",
      "create_new": "Создать", "owned_inventories": "Мои инвентари", "shared_with_me": "Доступные мне"
    }
  }
};

i18n.use(initReactI18next).init({ resources, lng: 'en', interpolation: { escapeValue: false } });

export default i18n;
