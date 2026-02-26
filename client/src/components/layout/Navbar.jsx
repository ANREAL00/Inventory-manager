import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { SearchHeader } from './SearchHeader';
import { LogOut, User } from 'lucide-react';

const Logo = () => (
    <Link to="/" className="text-xl font-bold tracking-tight">
        Inv<span className="text-blue-500">Manager</span>
    </Link>
);

const UserNav = ({ user, logout, t }) => (
    <div className="flex items-center gap-4">
        <Link to="/profile" className="flex items-center gap-2 hover:text-blue-500">
            <User size={18} />
            <span className="hidden sm:inline">{t('profile')}</span>
        </Link>
        <button onClick={logout} title={t('logout')} className="p-2 hover:text-red-500">
            <LogOut size={18} />
        </button>
    </div>
);

const AuthNav = ({ t }) => (
    <div className="flex gap-4 items-center">
        <Link to="/login" className="hover:text-blue-500">{t('login')}</Link>
        <Link to="/register" className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            {t('register')}
        </Link>
    </div>
);

export function Navbar() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Logo />
                <div className="flex-1 max-w-sm mx-4 hidden md:block">
                    <SearchHeader placeholder={t('search_placeholder')} />
                </div>
                <div className="flex items-center gap-6">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                    {user ? <UserNav user={user} logout={logout} t={t} /> : <AuthNav t={t} />}
                </div>
            </div>
        </nav>
    );
}
