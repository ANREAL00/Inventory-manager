import { useAdminUsers } from '../../hooks/useAdminUsers';
import { UserTable } from '../../components/admin/UserTable';
import { AdminToolbar } from '../../components/admin/AdminToolbar';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AdminDashboard() {
    const { user } = useAuth();
    const { users, loading, selectedIds, handleAction, toggleSelect, toggleSelectAll } = useAdminUsers();
    const { t } = useTranslation();

    if (user?.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto fade-in">
                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <ShieldAlert size={48} className="text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{t('access_denied')}</h2>
                <p className="text-gray-500 dark:text-gray-400">{t('access_denied_desc')}</p>
            </div>
        );
    }

    if (loading) return <div className="p-8 text-center text-gray-500">{t('loading_users')}</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            <h1 className="text-3xl font-extrabold px-1">{t('user_management')}</h1>
            <AdminToolbar onAction={handleAction} selectedCount={selectedIds.length} />
            <UserTable
                users={users}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                toggleAll={toggleSelectAll}
            />
        </div>
    );
}
