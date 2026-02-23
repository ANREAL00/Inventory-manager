import { useState, useEffect } from 'react';
import api from '../api';

export function useLikes(itemId) {
    const [likes, setLikes] = useState([]);
    const refetch = () => api.get(`/items/${itemId}/likes`).then(res => setLikes(res.data.likes));

    useEffect(() => { itemId && refetch(); }, [itemId]);

    const toggle = async () => {
        try { await api.post(`/items/${itemId}/like`); refetch(); }
        catch (e) { alert('Action failed. Are you logged in?'); }
    };

    return { likes, toggle };
}
