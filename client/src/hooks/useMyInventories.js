import { useState, useEffect } from 'react';
import { getMyInventories } from '../api/inventory';

export function useMyInventories() {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyInventories()
            .then(setInventories)
            .finally(() => setLoading(false));
    }, []);

    return { inventories, loading };
}
