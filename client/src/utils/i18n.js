import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "login": "Login", "register": "Register", "logout": "Logout", "profile": "Profile",
      "search_placeholder": "Search inventories and items...", "my_dashboard": "My Dashboard",
      "create_new": "Create New", "owned_inventories": "Owned Inventories", "shared_with_me": "Shared with Me",
      "admin_panel": "Admin Panel",
      "latest_inventories": "Latest Inventories", "most_popular": "Most Popular", "tag_cloud": "Tag Cloud",
      "loading_home": "Loading home page...",
      "user_management": "User Management", "loading_users": "Loading users...",
      "access_denied": "Access Denied", "access_denied_desc": "You do not have permission to view this page. This area is restricted to administrators only.",
      "col_title": "Title", "col_desc": "Description", "col_category": "Category", "col_owner": "Owner", "col_created": "Created", "col_id": "ID", "col_likes": "Likes",
      "no_inventories": "No inventories found.",
      "label_title": "Title", "placeholder_title": "e.g. My Book Collection",
      "label_desc": "Description (Markdown)", "placeholder_desc": "Describe your inventory...",
      "label_category": "Category", "label_illustration": "Illustration URL", "placeholder_illustration": "Cloudinary link or direct URL",
      "no_custom_fields": "No custom fields defined for this inventory.",
      "custom_id": "Custom ID", "save_item": "Save Item", "yes": "Yes", "no": "No",
      "create_inventory_title": "Create New Inventory", "tags_label": "Tags (Press Enter)", "add_tag": "Add tag...",
      "custom_fields": "Custom Fields", "save_inventory": "Save Inventory", "processing": "Processing...",
      "type_text": "Text", "type_multiline": "Multiline", "type_number": "Number", "type_image": "Image/Link", "type_checkbox": "Checkbox", "type_date": "Date",
      "cat_equipment": "Equipment", "cat_furniture": "Furniture", "cat_book": "Book", "cat_other": "Other",
      "tab_items": "Items", "tab_discussion": "Discussion", "tab_stats": "Stats", "tab_settings": "Settings", "tab_access": "Access", "tab_fields": "Fields", "tab_custom_id": "Custom ID",
      "loading_details": "Loading details...", "status_saving": "Saving...", "status_unsaved": "Unsaved changes", "status_saved": "Saved",
      "add_item": "Add Item", "items_title": "Items", "save_failed": "Save failed", "conflict_error": "Version conflict! Please refresh.",
      "placeholder_comment": "Write a comment...", "btn_post": "Post Comment",
      "calculating_stats": "Calculating stats...", "total_items": "Total Items", "stat_avg": "Avg", "stat_range": "Range", "stat_top": "Top", "stat_times": "times",
      "label_public": "Public Inventory", "desc_public": "Anyone can view and add items", "title_access": "Users with Access", "placeholder_user_search": "Type name or email to add...",
      "hint_custom_id": "Drag parts to reorder. Fixed: Custom text. Random: Unique numbers. Sequence: Auto-incrementing ID. GUID: Globally unique long ID.",
      "id_preview": "ID Preview", "loading_preview": "Loading preview...", "error_gen_id": "Error generating ID",
      "p_fixed": "Fixed", "p_random20": "Random 20-bit", "p_random32": "Random 32-bit", "p_random6": "Random 6-digit", "p_random9": "Random 9-digit", "p_guid": "GUID", "p_date": "Date", "p_sequence": "Sequence",
      "add_item_title": "Add New Item", "edit_item_title": "Edit Item", "view_item_title": "View Item", "delete_item": "Delete Item", "delete_confirm": "Delete this item?",
      "err_create_item": "Failed to create item", "err_update_item": "Update failed", "err_delete_item": "Delete failed", "err_conflict_item": "Conflict: Item was modified by another user.",
      "footer_text": "&copy; {{year}} Inventory Manager. Built with React & Tailwind.",
      "label_toggle_visibility": "Toggle Visibility in Table", "placeholder_field_title": "Field Title", "placeholder_tooltip": "Tooltip Description",
      "status_searching": "Searching...", "results_for": "Results for \"{{query}}\"", "no_items": "No items found.", "no_preview": "No preview available",
      "label_sort_by": "Sort by", "sort_name": "Name", "sort_email": "Email", "btn_help": "Help",
      "help_id_title": "Custom ID Format Guide", "help_fixed_desc": "Fixed Unicode text.", "help_random_desc": "Random digits/letters.", "help_guid_desc": "Standard unique ID.", "help_date_desc": "Current timestamp.", "help_sequence_desc": "Auto-incrementing number.",
      "placeholder_id_format": "Format: {{format}}",
      "click_to_upload": "Click to upload", "err_upload_failed": "Upload failed", "select_category": "Select Category"
    }
  },
  ru: {
    translation: {
      "login": "Вход", "register": "Регистрация", "logout": "Выход", "profile": "Профиль",
      "search_placeholder": "Поиск инвентарей и предметов...", "my_dashboard": "Панель управления",
      "create_new": "Создать", "owned_inventories": "Мои инвентари", "shared_with_me": "Доступные мне",
      "admin_panel": "Панель админа",
      "latest_inventories": "Последние инвентари", "most_popular": "Самые популярные", "tag_cloud": "Облако тегов",
      "loading_home": "Загрузка главной страницы...",
      "user_management": "Управление пользователями", "loading_users": "Загрузка пользователей...",
      "access_denied": "Доступ запрещен", "access_denied_desc": "У вас нет прав для просмотра этой страницы. Этот раздел доступен только администраторам.",
      "col_title": "Название", "col_desc": "Описание", "col_category": "Категория", "col_owner": "Владелец", "col_created": "Создан", "col_id": "ID", "col_likes": "Лайки",
      "no_inventories": "Инвентари не найдены.",
      "label_title": "Название", "placeholder_title": "напр. Моя коллекция книг",
      "label_desc": "Описание (Markdown)", "placeholder_desc": "Опишите ваш инвентарь...",
      "label_category": "Категория", "label_illustration": "Изображение инвентаря", "placeholder_illustration": "Нажмите для загрузки",
      "no_custom_fields": "Для этого инвентаря нет пользовательских полей.",
      "custom_id": "Пользовательский ID", "save_item": "Сохранить предмет", "yes": "Да", "no": "Нет",
      "create_inventory_title": "Создание инвентаря", "tags_label": "Теги (Enter для добавления)", "add_tag": "Добавить тег...",
      "custom_fields": "Пользовательские поля", "save_inventory": "Сохранить инвентарь", "processing": "Обработка...",
      "type_text": "Текст", "type_multiline": "Многострочный", "type_number": "Число", "type_image": "Изображение/Ссылка", "type_checkbox": "Чекбокс", "type_date": "Дата",
      "cat_equipment": "Оборудование", "cat_furniture": "Мебель", "cat_book": "Книга", "cat_other": "Прочее",
      "tab_items": "Предметы", "tab_discussion": "Обсуждение", "tab_stats": "Статистика", "tab_settings": "Настройки", "tab_access": "Доступ", "tab_fields": "Поля", "tab_custom_id": "Пользовательский ID",
      "loading_details": "Загрузка данных...", "status_saving": "Сохранение...", "status_unsaved": "Несохраненные изменения", "status_saved": "Сохранено",
      "add_item": "Добавить предмет", "items_title": "Предметы", "save_failed": "Ошибка сохранения", "conflict_error": "Конфликт версий! Пожалуйста, обновите страницу.",
      "placeholder_comment": "Напишите комментарий...", "btn_post": "Отправить",
      "calculating_stats": "Расчет статистики...", "total_items": "Всего предметов", "stat_avg": "Ср.", "stat_range": "Диапазон", "stat_top": "Топ", "stat_times": "раз",
      "label_public": "Публичный инвентарь", "desc_public": "Кто угодно может просматривать и добавлять предметы", "title_access": "Пользователи с доступом", "placeholder_user_search": "Введите имя или email для добавления...",
      "hint_custom_id": "Перетаскивайте части для изменения порядка. Fixed: Текст. Random: Числа. Sequence: Инкремент. GUID: Уникальный ID.",
      "id_preview": "Предпросмотр ID", "loading_preview": "Загрузка...", "error_gen_id": "Ошибка генерации ID",
      "p_fixed": "Текст", "p_random20": "Случ. 20-бит", "p_random32": "Случ. 32-бит", "p_random6": "Случ. 6 цифр", "p_random9": "Случ. 9 цифр", "p_guid": "GUID", "p_date": "Дата", "p_sequence": "Счетчик",
      "add_item_title": "Добавить предмет", "edit_item_title": "Редактировать предмет", "view_item_title": "Просмотр предмета", "delete_item": "Удалить предмет", "delete_confirm": "Удалить этот предмет?",
      "err_create_item": "Ошибка создания предмета", "err_update_item": "Ошибка обновления", "err_delete_item": "Ошибка удаления", "err_conflict_item": "Конфликт: Предмет был изменен другим пользователем.",
      "footer_text": "&copy; {{year}} Менеджер инвентаря. Создано на React и Tailwind.",
      "label_toggle_visibility": "Видимость в таблице", "placeholder_field_title": "Название поля", "placeholder_tooltip": "Описание (подсказка)",
      "status_searching": "Поиск...", "results_for": "Результаты для \"{{query}}\"", "no_items": "Предметы не найдены.", "no_preview": "Нет описания",
      "label_sort_by": "Сортировать по", "sort_name": "Имени", "sort_email": "Email", "btn_help": "Справка",
      "help_id_title": "Справка по формату ID", "help_fixed_desc": "Фиксированный текст (Unicode).", "help_random_desc": "Случайные числа/буквы.", "help_guid_desc": "Стандартный уникальный ID.", "help_date_desc": "Текущая дата/время.", "help_sequence_desc": "Автоинкремент (счетчик).",
      "placeholder_id_format": "Формат: {{format}}",
      "click_to_upload": "Нажмите для загрузки", "err_upload_failed": "Ошибка загрузки", "select_category": "Выберите категорию"
    }
  }
};

i18n.use(initReactI18next).init({ resources, lng: 'en', interpolation: { escapeValue: false } });

export default i18n;
