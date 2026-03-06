import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon } from 'lucide-react';

const TableHeader = ({ t }) => (
    <thead>
        <tr className="border-b text-left">
            <th className="p-2 w-16"></th>
            <th className="p-2">{t('col_title')}</th>
            <th className="p-2">{t('col_desc')}</th>
            <th className="p-2">{t('col_category')}</th>
            <th className="p-2">{t('col_owner')}</th>
            <th className="p-2">{t('col_created')}</th>
        </tr>
    </thead>
);

const InventoryRow = ({ item }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <td className="p-2">
                <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {item.imageUrl && !imgError ? (
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <ImageIcon className="text-gray-400" size={20} />
                    )}
                </div>
            </td>
            <td className="p-2">
                <Link to={`/inventories/${item.id}`} className="font-bold text-blue-500 hover:underline">{item.title}</Link>
            </td>
            <td className="p-2 text-sm text-gray-500 max-w-xs truncate">{item.description}</td>
            <td className="p-2">{item.category}</td>
            <td className="p-2 text-gray-500">{item.owner?.name || '-'}</td>
            <td className="p-2 text-sm">{new Date(item.createdAt).toLocaleDateString()}</td>
        </tr>
    );
};

export function InventoryList({ items }) {
    const { t } = useTranslation();

    if (items.length === 0) return <p className="text-gray-500">{t('no_inventories')}</p>;

    return (
        <table className="w-full border-collapse">
            <TableHeader t={t} />
            <tbody>
                {items.map(item => <InventoryRow key={item.id} item={item} />)}
            </tbody>
        </table>
    );
}
