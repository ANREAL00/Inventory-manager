import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useInventoryDetails } from '../../hooks/useInventoryDetails';
import { useAuth } from '../../hooks/useAuth';
import { ItemTable } from '../../components/items/ItemTable';
import { AddItemModal } from '../../components/items/AddItemModal';
import { Plus } from 'lucide-react';

const Header = ({ inventory }) => (
    <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-extrabold">{inventory.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{inventory.description}</p>
        <div className="flex gap-2">
            {inventory.tags.map(t => <span key={t.id} className="text-blue-500 font-medium">#{t.name}</span>)}
        </div>
    </div>
);

export function InventoryDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const { inventory, loading, refetch } = useInventoryDetails(id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (!inventory) return <div className="p-8 text-center text-red-500">Inventory not found</div>;

    const canEdit = user?.role === 'ADMIN' || user?.id === inventory.ownerId;

    return (
        <div className="max-w-6xl mx-auto py-8">
            <Header inventory={inventory} />
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-bold">Items</h3>
                {canEdit && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <Plus size={18} /> Add Item
                    </button>
                )}
            </div>
            <ItemTable items={inventory.items} fields={inventory.fields} />
            <AddItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                inventoryId={id}
                fields={inventory.fields}
                onCreated={refetch}
            />
        </div>
    );
}
