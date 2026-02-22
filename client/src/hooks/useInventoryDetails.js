import { useState, useEffect } from 'react';
import api from '../api';

export function useInventoryDetails(id) {
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            const { data } = await api.get(`/inventories/${id}`);
            setInventory(data.data.inventory);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (id) fetchDetails(); }, [id]);

    return { inventory, loading, refetch: fetchDetails };
}
