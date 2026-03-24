import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './Navbar';
import { useSupportTicket } from '../../context/SupportTicketContext';

export function Layout() {
    const { t } = useTranslation();
    const { openSupportModal } = useSupportTicket();
    const year = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                <Outlet />
            </main>
            <footer className="py-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <p>{t('footer_text', { year })}</p>
                <button
                    type="button"
                    onClick={openSupportModal}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {t('support_create_ticket')}
                </button>
            </footer>
        </div>
    );
}
