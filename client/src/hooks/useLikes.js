import { useState, useEffect } from 'react';
import api from '../api';

export function useLikes(itemId, userId) {
    const [likes, setLikes] = useState([]);
    const refetch = () => api.get(`/items/${itemId}/likes`).then(res => setLikes(res.data.likes));

    useEffect(() => { itemId && refetch(); }, [itemId]);

    const toggle = async () => {
        if (!userId) return;

        const isLiked = likes.some(l => l.userId === userId);
        const prevLikes = [...likes];

        const updatedLikes = isLiked
            ? likes.filter(l => l.userId !== userId)
            : [...likes, { userId }];

        setLikes(updatedLikes);

        try {
            await api.post(`/items/${itemId}/like`);
        } catch (e) {
            setLikes(prevLikes);
        }
    };

    return { likes, toggle };
}
