import { useState } from 'react';
import { useSharedInventories } from '../../hooks/useSharedInventories';
import { useMyInventories } from '../../hooks/useMyInventories';
import { InventoryList } from '../../components/inventory/InventoryList';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useFilteredSorted } from '../../hooks/useFilteredSorted';

const SectionTitle = ({ title }) => (
    <h2 className="text-2xl font-bold mb-4 mt-8">{title}</h2>
);

const Controls = ({ search, onSearchChange, sort, onSortChange, t }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('profile_filter_placeholder')}
            className="w-full sm:w-1/2 px-3 py-2 border rounded-md text-sm dark:bg-gray-900"
        />
        <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 border rounded-md text-sm dark:bg-gray-900"
        >
            <option value="created_desc">{t('sort_created_desc')}</option>
            <option value="created_asc">{t('sort_created_asc')}</option>
            <option value="title_asc">{t('sort_title_asc')}</option>
            <option value="title_desc">{t('sort_title_desc')}</option>
            <option value="category_asc">{t('sort_category_asc')}</option>
            <option value="category_desc">{t('sort_category_desc')}</option>
        </select>
    </div>
);

export function ProfilePage() {
    const { id } = useParams();
    const { user: authUser } = useAuth();
    const { t } = useTranslation();

    const isMe = !id || id === authUser?.id;

    const { inventories: myOwned, loading: l1 } = useMyInventories(!isMe);
    const { inventories: myShared, loading: l2 } = useSharedInventories(!isMe);
    const { user: otherUser, loading: l3, error } = useUserProfile(isMe ? null : id);

    const [ownedSearch, setOwnedSearch] = useState('');
    const [ownedSort, setOwnedSort] = useState('created_desc');
    const [sharedSearch, setSharedSearch] = useState('');
    const [sharedSort, setSharedSort] = useState('created_desc');
    const [otherSearch, setOtherSearch] = useState('');
    const [otherSort, setOtherSort] = useState('created_desc');

    const ownedView = useFilteredSorted(myOwned, ownedSearch, ownedSort);
    const sharedView = useFilteredSorted(myShared, sharedSearch, sharedSort);
    const otherView = useFilteredSorted(otherUser?.inventories || [], otherSearch, otherSort);

    if (isMe) {
        if (l1 || l2) return <div className="p-8 text-center text-gray-500">{t('loading_details')}</div>;
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold">{t('my_dashboard')}</h1>
                    <div className="flex gap-2 sm:gap-4 flex-wrap">
                        {authUser?.role === 'ADMIN' && (
                            <Link to="/admin" className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm sm:text-base">
                                {t('admin_panel')}
                            </Link>
                        )}
                        <Link to="/inventories/new" className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base">
                            {t('create_new')}
                        </Link>
                    </div>
                </div>
                <SectionTitle title={t('owned_inventories')} />
                <Controls
                    search={ownedSearch}
                    onSearchChange={setOwnedSearch}
                    sort={ownedSort}
                    onSortChange={setOwnedSort}
                    t={t}
                />
                <InventoryList items={ownedView} />

                <SectionTitle title={t('shared_with_me')} />
                <Controls
                    search={sharedSearch}
                    onSearchChange={setSharedSearch}
                    sort={sharedSort}
                    onSortChange={setSharedSort}
                    t={t}
                />
                <InventoryList items={sharedView} />
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
            <Controls
                search={otherSearch}
                onSearchChange={setOtherSearch}
                sort={otherSort}
                onSortChange={setOtherSort}
                t={t}
            />
            <InventoryList items={otherView} />
        </div>
    );
}
