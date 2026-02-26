import { useSharedInventories } from '../../hooks/useSharedInventories';
import { useMyInventories } from '../../hooks/useMyInventories';
import { InventoryList } from '../../components/inventory/InventoryList';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SectionTitle = ({ title }) => (
    <h2 className="text-2xl font-bold mb-4 mt-8">{title}</h2>
);

export function ProfilePage() {
    const { inventories: owned, loading: l1 } = useMyInventories();
    const { inventories: shared, loading: l2 } = useSharedInventories();
    const { t } = useTranslation();

    if (l1 || l2) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold">{t('my_dashboard')}</h1>
                <Link to="/inventories/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    {t('create_new')}
                </Link>
            </div>
            <SectionTitle title={t('owned_inventories')} />
            <InventoryList items={owned} />

            <SectionTitle title={t('shared_with_me')} />
            <InventoryList items={shared} />
        </div>
    );
}
