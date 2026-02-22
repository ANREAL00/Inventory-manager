import { useMyInventories } from '../../hooks/useMyInventories';
import { InventoryList } from '../../components/inventory/InventoryList';
import { Link } from 'react-router-dom';

const SectionTitle = ({ title }) => (
    <h2 className="text-2xl font-bold mb-4 mt-8">{title}</h2>
);

export function ProfilePage() {
    const { inventories, loading } = useMyInventories();

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold">My Dashboard</h1>
                <Link to="/inventories/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Create New
                </Link>
            </div>
            <SectionTitle title="Owned Inventories" />
            <InventoryList items={inventories} />

            <SectionTitle title="Shared with Me" />
            <InventoryList items={[]} />
        </div>
    );
}
