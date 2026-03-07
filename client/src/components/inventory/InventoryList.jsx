import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon } from 'lucide-react';

const TableHeader = ({ t }) => (
    <thead>
        <tr className="border-b text-left text-xs sm:text-sm">
            <th className="p-2 w-10 sm:w-14"></th>
            <th className="p-2">{t('col_title')}</th>
            <th className="p-2 hidden sm:table-cell">{t('col_desc')}</th>
            <th className="p-2 hidden md:table-cell">{t('col_category')}</th>
            <th className="p-2 hidden md:table-cell">{t('col_owner')}</th>
            <th className="p-2 hidden sm:table-cell">{t('col_created')}</th>
        </tr>
    </thead>
);

const InventoryRow = ({ item }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-xs sm:text-sm">
            <td className="p-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {item.imageUrl && !imgError ? (
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <ImageIcon className="text-gray-400" size={16} />
                    )}
                </div>
            </td>
            <td className="p-2">
                <Link to={`/inventories/${item.id}`} className="font-bold text-blue-500 hover:underline line-clamp-2">{item.title}</Link>
            </td>
            <td className="p-2 text-sm text-gray-500 max-w-[180px] truncate hidden sm:table-cell">{item.description}</td>
            <td className="p-2 hidden md:table-cell">{item.category}</td>
            <td className="p-2 text-gray-500 hidden md:table-cell">{item.owner?.name || '-'}</td>
            <td className="p-2 hidden sm:table-cell">{new Date(item.createdAt).toLocaleDateString()}</td>
        </tr>
    );
};

export function InventoryList({ items }) {
    const { t } = useTranslation();

    if (items.length === 0) return <p className="text-gray-500">{t('no_inventories')}</p>;

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse text-sm">
                <TableHeader t={t} />
                <tbody>
                    {items.map(item => <InventoryRow key={item.id} item={item} />)}
                </tbody>
            </table>
        </div>
    );
}
