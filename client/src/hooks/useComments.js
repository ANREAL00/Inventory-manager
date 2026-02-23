import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import api from '../api';

export function useComments(inventoryId) {
    const [comments, setComments] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const s = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');
        s.emit('join_inventory', inventoryId);
        s.on('new_comment', (c) => setComments(prev => [...prev, c]));
        setSocket(s);
        return () => s.disconnect();
    }, [inventoryId]);

    useEffect(() => {
        api.get(`/inventories/${inventoryId}/comments`).then(res => setComments(res.data.comments));
    }, [inventoryId]);

    const postComment = (content) => api.post(`/inventories/${inventoryId}/comments`, { content });

    return { comments, postComment };
}
