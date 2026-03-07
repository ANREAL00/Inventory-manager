import { useState, useEffect } from 'react';
import { getMyInventories } from '../api/inventory';

export function useMyInventories(skip = false) {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(!skip);

    useEffect(() => {
        if (skip) return;
        setLoading(true);
        getMyInventories()
            .then(setInventories)
            .finally(() => setLoading(false));
    }, [skip]);

    return { inventories, loading };
}
