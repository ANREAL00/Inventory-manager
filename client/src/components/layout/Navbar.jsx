import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { SearchHeader } from './SearchHeader';
import { LogOut, User, Menu, X, CircleHelp } from 'lucide-react';
import { useSupportTicket } from '../../context/SupportTicketContext';
import { useState } from 'react';

const Logo = () => (
    <Link to="/" className="text-lg sm:text-xl font-bold tracking-tight shrink-0">
        Inv<span className="text-blue-500">Manager</span>
    </Link>
);

const UserNav = ({ user, logout, t }) => (
    <div className="flex items-center gap-3">
        <Link to="/profile" className="flex items-center gap-1.5 hover:text-blue-500">
            <User size={18} className="shrink-0" />
            <span className="hidden sm:inline truncate max-w-[100px]">{t('profile')}</span>
        </Link>
        <button onClick={logout} title={t('logout')} className="p-2 hover:text-red-500 shrink-0">
            <LogOut size={18} />
        </button>
    </div>
);

const AuthNav = ({ t }) => (
    <div className="flex gap-2 sm:gap-4 items-center">
        <Link to="/login" className="hover:text-blue-500 whitespace-nowrap text-sm sm:text-base">{t('login')}</Link>
        <Link to="/register" className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap text-sm sm:text-base">
            {t('register')}
        </Link>
    </div>
);

const MobileMenu = ({ user, logout, t, open, onSupport }) => {
    if (!open) return null;
    return (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex flex-col gap-3">
            <SearchHeader placeholder={t('search_placeholder')} />
            <div className="flex items-center gap-3">
                <button type="button" onClick={onSupport} className="flex items-center gap-2 hover:text-blue-500">
                    <CircleHelp size={18} /> {t('support_link')}
                </button>
                <LanguageSwitcher />
                <ThemeSwitcher />
            </div>
            {user ? (
                <div className="flex flex-col gap-2">
                    <Link to="/profile" className="flex items-center gap-2 hover:text-blue-500">
                        <User size={18} /> {t('profile')}
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 text-red-500 hover:text-red-600">
                        <LogOut size={18} /> {t('logout')}
                    </button>
                </div>
            ) : (
                <div className="flex gap-3">
                    <Link to="/login" className="hover:text-blue-500">{t('login')}</Link>
                    <Link to="/register" className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600">{t('register')}</Link>
                </div>
            )}
        </div>
    );
};

export function Navbar() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const { openSupportModal } = useSupportTicket();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
                <Logo />
                <div className="flex-1 max-w-sm mx-4 hidden md:block">
                    <SearchHeader placeholder={t('search_placeholder')} />
                </div>
                <div className="hidden md:flex items-center gap-4 sm:gap-6">
                    <button
                        type="button"
                        onClick={openSupportModal}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                        title={t('support_tooltip')}
                    >
                        <CircleHelp size={22} />
                    </button>
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                    {user ? <UserNav user={user} logout={logout} t={t} /> : <AuthNav t={t} />}
                </div>
                <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
            <MobileMenu
                user={user}
                logout={logout}
                t={t}
                open={menuOpen}
                onSupport={() => {
                    openSupportModal();
                    setMenuOpen(false);
                }}
            />
        </nav>
    );
}
