import { useParams } from 'react-router-dom';
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
import { Plus, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../api';

import ReactMarkdown from 'react-markdown';

const Header = ({ inventory }) => (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
        {inventory.imageUrl && (
            <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                <img src={inventory.imageUrl} alt={inventory.title} className="w-full h-full object-cover" />
            </div>
        )}
        <div className="space-y-4 flex-1">
            <h1 className="text-4xl font-extrabold">{inventory.title}</h1>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <ReactMarkdown>{inventory.description}</ReactMarkdown>
            </div>
            <div className="flex gap-2">
                {inventory.tags.map(t => <span key={t.id} className="text-blue-500 font-medium">#{t.name}</span>)}
            </div>
        </div>
    </div>
);

const ItemsView = ({ inventory, canEdit, onAdd, onItemClick, t }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{t('items_title')}</h3>
            {canEdit && (
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <Plus size={18} /> {t('add_item')}
                </button>
            )}
        </div>
        <ItemTable items={inventory.items} fields={inventory.fields} onItemClick={onItemClick} />
    </div>
);

export function InventoryDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const { inventory, loading, refetch } = useInventoryDetails(id);
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('items');
    const [localData, setLocalData] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => { if (inventory) setLocalData(inventory); }, [inventory]);

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
    ].filter(t => ['items', 'discussion', 'stats'].includes(t.id) || canManageSet);

    const update = (f) => { setLocalData(p => ({ ...p, ...f })); setIsDirty(true); };

    return (
        <div className="max-width-6xl mx-auto py-8 px-4">
            <div className="flex justify-between items-start mb-6">
                <Header inventory={inventory} />
                {canManageSet && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        {isSaving ? t('status_saving') : (isDirty ? t('status_unsaved') : t('status_saved'))}
                        <button onClick={save} disabled={isSaving || !isDirty} className="p-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 transition-colors"><Save size={16} /></button>
                    </div>
                )}
            </div>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === 'items' && <ItemsView inventory={inventory} canEdit={canWriteItems} onAdd={() => setIsModalOpen(true)} onItemClick={setSelectedItem} t={t} />}
            {activeTab === 'discussion' && <DiscussionView inventoryId={id} />}
            {activeTab === 'stats' && <StatisticsView inventoryId={id} />}
            {activeTab === 'settings' && (
                <div className="space-y-8 bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl"><BasicInfoStep data={localData} update={update} /><CategoryImageStep data={localData} update={update} /></div>
            )}
            {activeTab === 'access' && (
                <div className="bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl">
                    <AccessSettingsView isPublic={localData.isPublic} authorizedUsers={localData.authorizedUsers} onChange={update} />
                </div>
            )}
            {activeTab === 'fields' && (
                <div className="bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl">
                    <FieldConfigurator fields={localData.fields} addField={(t) => update({ fields: [...localData.fields, { type: t, title: '', index: localData.fields.filter(f => f.type === t).length + 1, isVisible: true }] })} updateField={(idx, u) => update({ fields: localData.fields.map((f, i) => i === idx ? { ...f, ...u } : f) })} removeField={(idx) => update({ fields: localData.fields.filter((_, i) => i !== idx) })} />
                </div>
            )}
            {activeTab === 'custom-id' && (
                <div className="bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl">
                    <CustomIdConfig config={(typeof localData.customIdConfig === 'string' ? JSON.parse(localData.customIdConfig) : localData.customIdConfig) || []} inventoryId={id} onChange={(c) => update({ customIdConfig: c })} />
                </div>
            )}
            <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} inventoryId={id} fields={inventory.fields} customIdConfig={localData.customIdConfig} onCreated={refetch} />
            <EditItemModal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} item={selectedItem} fields={inventory.fields} customIdConfig={localData.customIdConfig} onUpdated={refetch} canEdit={canWriteItems} />
        </div>
    );
}
