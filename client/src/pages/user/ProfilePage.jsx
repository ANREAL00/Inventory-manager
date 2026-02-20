import { useMyInventories } from '../../hooks/useMyInventories';
import { InventoryList } from '../../components/inventory/InventoryList';

const SectionTitle = ({ title }) => (
    <h2 className="text-2xl font-bold mb-4 mt-8">{title}</h2>
);

export function ProfilePage() {
    const { inventories, loading } = useMyInventories();

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-8">My Dashboard</h1>

            <SectionTitle title="Owned Inventories" />
            <InventoryList items={inventories} />

            <SectionTitle title="Shared with Me" />
            <InventoryList items={[]} />
        </div>
    );
}
