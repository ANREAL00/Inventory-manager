import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';
import { InventoryList } from '../components/inventory/InventoryList';

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

    if (loading) return <div className="p-8 text-center text-gray-500">Searching...</div>;

    return (
        <div className="space-y-12 py-8">
            <h1 className="text-3xl font-extrabold">Results for "{query}"</h1>
            <Section title="Inventories"><InventoryList items={results.inventories} /></Section>
            <Section title="Items">
                {results.items.length > 0 ? (
                    <div className="space-y-4">
                        {results.items.map(it => (
                            <div key={it.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                <Link to={`/inventories/${it.inventoryId}`} className="font-bold text-blue-500 hover:underline">{it.customId}</Link>
                                <p className="text-sm text-gray-500 line-clamp-2">{it.string1 || it.text1 || 'No preview available'}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-gray-500">No items found.</p>}
            </Section>
        </div>
    );
}
