import { useState, useEffect } from 'react';
import api from '../api';

export function useSharedInventories() {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/inventories/shared')
            .then(res => setInventories(res.data.data.inventories))
            .finally(() => setLoading(false));
    }, []);

    return { inventories, loading };
}
