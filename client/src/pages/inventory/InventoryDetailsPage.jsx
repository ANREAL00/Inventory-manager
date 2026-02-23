import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useInventoryDetails } from '../../hooks/useInventoryDetails';
import { useAuth } from '../../hooks/useAuth';
import { ItemTable } from '../../components/items/ItemTable';
import { AddItemModal } from '../../components/items/AddItemModal';
import { Tabs } from '../../components/ui/Tabs';
import { CustomIdConfig } from '../../components/inventory/CustomIdConfig';
import { FieldConfigurator } from '../../components/inventory/fields/FieldConfigurator';
import { BasicInfoStep } from '../../components/inventory/wizard/BasicInfoStep';
import { CategoryImageStep } from '../../components/inventory/wizard/CategoryImageStep';
import { DiscussionView } from '../../components/inventory/DiscussionView';
import { Plus, Save } from 'lucide-react';
import api from '../../api';

const Header = ({ inventory }) => (
    <div className="space-y-4 mb-4">
        <h1 className="text-4xl font-extrabold">{inventory.title}</h1>
        <div className="flex gap-2">
            {inventory.tags.map(t => <span key={t.id} className="text-blue-500 font-medium">#{t.name}</span>)}
        </div>
    </div>
);

const ItemsView = ({ inventory, canEdit, onAdd }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Items</h3>
            {canEdit && (
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <Plus size={18} /> Add Item
                </button>
            )}
        </div>
        <ItemTable items={inventory.items} fields={inventory.fields} />
    </div>
);

export function InventoryDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const { inventory, loading, refetch } = useInventoryDetails(id);
    const [activeTab, setActiveTab] = useState('items');
    const [localData, setLocalData] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => { if (inventory) setLocalData(inventory); }, [inventory]);

    const save = async () => {
        if (!localData) return;
        setIsSaving(true);
        try {
            const data = { ...localData, fields: localData.fields.map(({ inventory, ...f }) => f) };
            await api.patch(`/inventories/${id}`, data);
            setIsDirty(false);
        } finally { setIsSaving(false); }
    };

    useEffect(() => {
        const timer = isDirty && !isSaving && setTimeout(save, 8000);
        return () => clearTimeout(timer);
    }, [localData, isDirty, isSaving]);

    if (loading || !localData) return <div className="p-8 text-center text-gray-500">Loading details...</div>;

    const canEdit = user?.role === 'ADMIN' || user?.id === inventory.ownerId;
    const tabs = [{ id: 'items', label: 'Items' }, { id: 'discussion', label: 'Discussion' }, { id: 'settings', label: 'Settings' }, { id: 'fields', label: 'Fields' }, { id: 'custom-id', label: 'Custom ID' }].filter(t => ['items', 'discussion'].includes(t.id) || canEdit);
    const update = (f) => { setLocalData(p => ({ ...p, ...f })); setIsDirty(true); };

    return (
        <div className="max-width-6xl mx-auto py-8 px-4">
            <div className="flex justify-between items-start mb-6">
                <Header inventory={inventory} />
                {canEdit && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        {isSaving ? 'Saving...' : (isDirty ? 'Unsaved changes' : 'Saved')}
                        <button onClick={save} disabled={isSaving || !isDirty} className="p-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 transition-colors"><Save size={16} /></button>
                    </div>
                )}
            </div>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === 'items' && <ItemsView inventory={inventory} canEdit={canEdit} onAdd={() => setIsModalOpen(true)} />}
            {activeTab === 'discussion' && <DiscussionView inventoryId={id} />}
            {activeTab === 'settings' && (
                <div className="space-y-8 bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl"><BasicInfoStep data={localData} update={update} /><CategoryImageStep data={localData} update={update} /></div>
            )}
            {activeTab === 'fields' && (
                <div className="bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl">
                    <FieldConfigurator fields={localData.fields} addField={(t) => update({ fields: [...localData.fields, { type: t, title: '', index: localData.fields.filter(f => f.type === t).length + 1, isVisible: true }] })} updateField={(idx, u) => update({ fields: localData.fields.map((f, i) => i === idx ? { ...f, ...u } : f) })} removeField={(idx) => update({ fields: localData.fields.filter((_, i) => i !== idx) })} />
                </div>
            )}
            {activeTab === 'custom-id' && (
                <div className="bg-white dark:bg-gray-950 p-6 border rounded-xl max-w-2xl">
                    <CustomIdConfig config={typeof localData.customIdConfig === 'string' ? JSON.parse(localData.customIdConfig) : (localData.customIdConfig || [])} onChange={(c) => update({ customIdConfig: c })} />
                </div>
            )}
            <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} inventoryId={id} fields={inventory.fields} onCreated={refetch} />
        </div>
    );
}
