import { useState, useEffect } from 'react';
import api from '../api';

export function useInventories(params = {}) {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInventories = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/inventories', { params });
            setInventories(data?.data?.inventories || []);
        } catch (err) {
            console.error('Failed to fetch inventories:', err);
            setInventories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInventories(); }, [JSON.stringify(params)]);

    return { inventories, loading, refetch: fetchInventories };
}
