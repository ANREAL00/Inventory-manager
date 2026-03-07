import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';
import { InventoryList } from '../components/inventory/InventoryList';
import { useTranslation } from 'react-i18next';

const Section = ({ title, children }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">{title}</h2>
        {children}
    </div>
);

export function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState({ inventories: [], items: [] });
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/search?q=${query}`);
                setResults(data.data);
            } finally { setLoading(false); }
        };
        if (query) fetchResults();
    }, [query]);

    if (loading) return <div className="p-8 text-center text-gray-500">{t('status_searching')}</div>;

    return (
        <div className="space-y-12 py-8">
            <h1 className="text-3xl font-extrabold">{t('results_for', { query })}</h1>
            <Section title={t('inventories_title')}><InventoryList items={results.inventories} /></Section>
            <Section title={t('items_title')}>
                {results.items.length > 0 ? (
                    <div className="space-y-4">
                        {results.items.map(it => (
                            <div key={it.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                <Link to={`/inventories/${it.inventoryId}`} className="font-bold text-lg text-blue-600 hover:underline capitalize block mb-1">
                                    {it.string1 || it.customId}
                                </Link>
                                <div className="flex gap-2 text-xs text-gray-400 mb-2">
                                    <span className="font-mono">{it.customId}</span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">{it.description || it.text1 || t('no_preview')}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-gray-500">{t('no_items')}</p>}
            </Section>
        </div>
    );
}
