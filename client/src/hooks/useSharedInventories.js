import { useState, useEffect } from 'react';
import api from '../api';

export function useSharedInventories(skip = false) {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(!skip);

    useEffect(() => {
        if (skip) return;
        setLoading(true);
        api.get('/inventories/shared')
            .then(res => setInventories(res.data.data.inventories))
            .finally(() => setLoading(false));
    }, [skip]);

    return { inventories, loading };
}
