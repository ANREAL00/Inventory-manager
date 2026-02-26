import { useInventories } from '../hooks/useInventories';
import { InventoryList } from '../components/inventory/InventoryList';
import { TagCloud } from '../components/common/TagCloud';
import { useState, useEffect } from 'react';
import api from '../api';

const Section = ({ title, children }) => (
    <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b pb-2">{title}</h2>
        {children}
    </section>
);

export function HomePage() {
    const { inventories: latest, loading: l1 } = useInventories();
    const [popular, setPopular] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        api.get('/inventories/popular')
            .then(res => setPopular(res.data?.data?.inventories || []))
            .catch(err => console.error('Failed to fetch popular inventories:', err));

        api.get('/inventories/tags')
            .then(res => setTags(res.data?.data?.tags || []))
            .catch(err => console.error('Failed to fetch tags:', err));
    }, []);

    if (l1) return <div className="p-8 text-center text-gray-500">Loading home page...</div>;

    return (
        <div className="space-y-12 py-6">
            <Section title="Latest Inventories"><InventoryList items={latest || []} /></Section>
            <Section title="Most Popular"><InventoryList items={popular || []} /></Section>
            <Section title="Tag Cloud"><TagCloud tags={tags || []} /></Section>
        </div>
    );
}
