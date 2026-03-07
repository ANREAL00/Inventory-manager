import { useSharedInventories } from '../../hooks/useSharedInventories';
import { useMyInventories } from '../../hooks/useMyInventories';
import { InventoryList } from '../../components/inventory/InventoryList';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';

const SectionTitle = ({ title }) => (
    <h2 className="text-2xl font-bold mb-4 mt-8">{title}</h2>
);

export function ProfilePage() {
    const { id } = useParams();
    const { user: authUser } = useAuth();
    const { t } = useTranslation();

    const isMe = !id || id === authUser?.id;

    const { inventories: myOwned, loading: l1 } = useMyInventories(!isMe);
    const { inventories: myShared, loading: l2 } = useSharedInventories(!isMe);
    const { user: otherUser, loading: l3, error } = useUserProfile(isMe ? null : id);

    if (isMe) {
        if (l1 || l2) return <div className="p-8 text-center text-gray-500">{t('loading_details')}</div>;
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold">{t('my_dashboard')}</h1>
                    <div className="flex gap-4">
                        {authUser?.role === 'ADMIN' && (
                            <Link to="/admin" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                                {t('admin_panel')}
                            </Link>
                        )}
                        <Link to="/inventories/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            {t('create_new')}
                        </Link>
                    </div>
                </div>
                <SectionTitle title={t('owned_inventories')} />
                <InventoryList items={myOwned} />

                <SectionTitle title={t('shared_with_me')} />
                <InventoryList items={myShared} />
            </div>
        );
    }

    if (l3) return <div className="p-8 text-center text-gray-500">{t('loading_details')}</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 p-6 bg-white dark:bg-gray-950 border rounded-2xl shadow-sm">
                <h1 className="text-3xl font-extrabold text-blue-600">{otherUser.name}</h1>
                <p className="text-gray-500 mt-1">{otherUser.email}</p>
                <p className="text-xs text-gray-400 mt-4 uppercase font-bold tracking-widest">{t('col_created')}: {new Date(otherUser.createdAt).toLocaleDateString()}</p>
            </div>

            <SectionTitle title={t('owned_inventories')} />
            <InventoryList items={otherUser.inventories} />
        </div>
    );
}
