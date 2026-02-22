import { Link } from 'react-router-dom';

const TableHeader = () => (
    <thead>
        <tr className="border-b text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Category</th>
            <th className="p-2">Created</th>
        </tr>
    </thead>
);

const InventoryRow = ({ item }) => (
    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
        <td className="p-2">
            <Link to={`/inventories/${item.id}`} className="text-blue-500 hover:underline">
                {item.title}
            </Link>
        </td>
        <td className="p-2">{item.category}</td>
        <td className="p-2 text-gray-500">{item.owner?.name || '-'}</td>
        <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
    </tr>
);

export function InventoryList({ items }) {
    if (items.length === 0) return <p className="text-gray-500">No inventories found.</p>;

    return (
        <table className="w-full border-collapse">
            <TableHeader />
            <tbody>
                {items.map(item => <InventoryRow key={item.id} item={item} />)}
            </tbody>
        </table>
    );
}
