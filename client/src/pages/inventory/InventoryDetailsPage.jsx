import { useParams } from 'react-router-dom';
import { useInventoryDetails } from '../../hooks/useInventoryDetails';
import { ItemTable } from '../../components/items/ItemTable';

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
    const { inventory, loading } = useInventoryDetails(id);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (!inventory) return <div className="p-8 text-center text-red-500">Inventory not found</div>;

    return (
        <div className="max-w-6xl mx-auto py-8">
            <Header inventory={inventory} />
            <div className="mb-6"><h3 className="text-xl font-bold">Items</h3></div>
            <ItemTable items={inventory.items} fields={inventory.fields} />
        </div>
    );
}
