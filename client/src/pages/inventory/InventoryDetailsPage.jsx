import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useInventoryDetails } from '../../hooks/useInventoryDetails';
import { useAuth } from '../../hooks/useAuth';
import { ItemTable } from '../../components/items/ItemTable';
import { AddItemModal } from '../../components/items/AddItemModal';
import { EditItemModal } from '../../components/items/EditItemModal';
import { Tabs } from '../../components/ui/Tabs';
import { CustomIdConfig } from '../../components/inventory/CustomIdConfig';
import { FieldConfigurator } from '../../components/inventory/fields/FieldConfigurator';
import { BasicInfoStep } from '../../components/inventory/wizard/BasicInfoStep';
import { CategoryImageStep } from '../../components/inventory/wizard/CategoryImageStep';
import { DiscussionView } from '../../components/inventory/DiscussionView';
import { AccessSettingsView } from '../../components/inventory/AccessSettingsView';
import { StatisticsView } from '../../components/inventory/StatisticsView';
import { OdooApiTokenPanel } from '../../components/inventory/OdooApiTokenPanel';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../api';

import ReactMarkdown from 'react-markdown';

const Header = ({ inventory }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
            {inventory.imageUrl && !imgError && (
                <div className="w-full sm:w-40 md:w-48 h-40 sm:h-48 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                    <img
                        src={inventory.imageUrl}
                        alt={inventory.title}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                </div>
            )}
            <div className="space-y-3 flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">{inventory.title}</h1>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    <ReactMarkdown>{inventory.description}</ReactMarkdown>
                </div>
                <div className="flex flex-wrap gap-2">
                    {inventory.tags.map(t => <span key={t.id} className="text-blue-500 font-medium text-sm">#{t.name}</span>)}
                </div>
            </div>
        </div>
    );
};

const ItemsView = ({ inventory, canEdit, onAdd, onItemClick, t }) => (
    <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
            <h3 className="text-lg sm:text-xl font-bold">{t('items_title')}</h3>
            {canEdit && (
                <button onClick={onAdd} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base shrink-0">
                    <Plus size={16} /> {t('add_item')}
                </button>
            )}
        </div>
        <ItemTable items={inventory.items} fields={inventory.fields} onItemClick={onItemClick} />
    </div>
);

export function InventoryDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { inventory, loading, refetch } = useInventoryDetails(id);
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('items');
    const [localData, setLocalData] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (inventory && !localData) setLocalData(inventory);
    }, [inventory, localData]);

    const handleRefetch = async () => {
        const { data } = await api.get(`/inventories/${id}`);
        const fresh = data.data.inventory;
        setLocalData(prev => ({ ...prev, items: fresh.items, _count: fresh._count }));
    };

    const save = async () => {
        if (!localData) return;
        setIsSaving(true);
        try {
            const data = { ...localData, fields: localData.fields.map(({ inventory, ...f }) => f) };
            const res = await api.patch(`/inventories/${id}`, data);
            setLocalData(res.data.data.inventory);
            setIsDirty(false);
        } catch (e) {
            const msg = e.response?.data?.error || e.response?.data?.message || t('save_failed');
            alert(e.response?.status === 409 ? t('conflict_error') : `${t('save_failed')}: ${msg}`);
        }
        finally { setIsSaving(false); }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        try {
            await api.delete(`/inventories/${id}`);
            navigate('/');
        } catch (e) {
            alert(t('delete_failed'));
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    useEffect(() => {
        const timer = isDirty && !isSaving && setTimeout(save, 8000);
        return () => clearTimeout(timer);
    }, [localData, isDirty, isSaving]);

    if (loading || !localData) return <div className="p-8 text-center text-gray-500">{t('loading_details')}</div>;

    const isOwner = user?.id === inventory.ownerId;
    const isAdmin = user?.role === 'ADMIN';
    const isAuthorized = inventory.authorizedUsers?.some(u => u.id === user?.id) || (inventory.isPublic && user);

    const canManageSet = isAdmin || isOwner;
    const canWriteItems = isAdmin || isOwner || isAuthorized;

    const tabs = [
        { id: 'items', label: t('tab_items') },
        { id: 'discussion', label: t('tab_discussion') },
        { id: 'stats', label: t('tab_stats') },
        { id: 'settings', label: t('tab_settings') },
        { id: 'access', label: t('tab_access') },
        { id: 'fields', label: t('tab_fields') },
        { id: 'custom-id', label: t('tab_custom_id') }
    ].filter(t => ['items', 'discussion'].includes(t.id) || canManageSet);

    const update = (f) => { setLocalData(p => ({ ...p, ...f })); setIsDirty(true); };

    return (
        <div className="max-width-6xl mx-auto py-4 sm:py-8 px-0 sm:px-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                <Header inventory={localData} />
                {canManageSet && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 shrink-0">
                        {isSaving ? t('status_saving') : (isDirty ? t('status_unsaved') : t('status_saved'))}
                        <button
                            onClick={save}
                            disabled={isSaving || !isDirty}
                            className="p-2 bg-blue-600 text-white rounded-md disabled:bg-gray-500 transition-colors"
                        >
                            <Save size={16} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            disabled={!(isAdmin || isOwner)}
                            className="p-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                )}
            </div>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === 'items' && <ItemsView inventory={localData} canEdit={canWriteItems} onAdd={() => setIsModalOpen(true)} onItemClick={setSelectedItem} t={t} />}
            {activeTab === 'discussion' && <DiscussionView inventoryId={id} />}
            {activeTab === 'stats' && <StatisticsView inventoryId={id} />}
            {activeTab === 'settings' && (
                <div className="space-y-8 bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl">
                    <BasicInfoStep data={localData} update={update} />
                    <CategoryImageStep data={localData} update={update} />
                    <OdooApiTokenPanel inventoryId={id} />
                </div>
            )}
            {activeTab === 'access' && (
                <div className="bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl">
                    <AccessSettingsView isPublic={localData.isPublic} authorizedUsers={localData.authorizedUsers} onChange={update} />
                </div>
            )}
            {activeTab === 'fields' && (
                <div className="bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl">
                    <FieldConfigurator
                        fields={localData.fields}
                        reorderFields={(f) => update({ fields: f })}
                        addField={(t) => update({ fields: [...localData.fields, { id: `new-${Date.now()}`, type: t, title: '', index: localData.fields.filter(f => f.type === t).length + 1, isVisible: true }] })}
                        updateField={(idx, u) => update({ fields: localData.fields.map((f, i) => i === idx ? { ...f, ...u } : f) })}
                        removeField={(idx) => update({ fields: localData.fields.filter((_, i) => i !== idx) })}
                    />
                </div>
            )}
            {activeTab === 'custom-id' && (
                <div className="bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl">
                    <CustomIdConfig config={(typeof localData.customIdConfig === 'string' ? JSON.parse(localData.customIdConfig) : localData.customIdConfig) || []} inventoryId={id} onChange={(c) => update({ customIdConfig: c })} />
                </div>
            )}
            <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} inventoryId={id} fields={localData.fields} customIdConfig={localData.customIdConfig} onCreated={handleRefetch} />
            <EditItemModal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} item={selectedItem} fields={localData.fields} customIdConfig={localData.customIdConfig} onUpdated={handleRefetch} canEdit={canWriteItems} />

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
                        <h2 className="text-lg font-bold mb-2">{t('delete_inventory_title') || 'Delete inventory?'}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {t('delete_inventory_confirm') || 'Are you sure you want to delete this inventory? This action cannot be undone.'}
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={cancelDelete}
                                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                {t('no')}
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
                            >
                                {t('yes')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
