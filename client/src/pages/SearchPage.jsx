import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';
import { InventoryList } from '../components/inventory/InventoryList';

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
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Search results for "{query}"</h1>
            {results.inventories.length > 0 && <InventoryList items={results.inventories} />}
            {results.inventories.length === 0 && <div className="text-gray-500">No results found.</div>}
        </div>
    );
}
