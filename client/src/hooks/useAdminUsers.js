import { useState, useEffect } from 'react';
import api from '../api';

export function useAdminUsers() {
    const [users, setUsers] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data.data.users);
        } catch (e) {
            /* ignore 403 */
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAction = async (action, method = 'patch', body = null) => {
        try {
            await Promise.all(
                selectedIds.map(id => {
                    const url = method === 'delete' ? `/users/${id}` : `/users/${id}/${action}`;
                    return api[method](url, body);
                })
            );
            await fetchUsers();
            setSelectedIds([]);
        } catch (err) {
            if (err.response?.status === 403) {
                window.location.reload();
            } else {
                alert(err.response?.data?.message || 'Bulk action failed');
            }
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === users.length ? [] : users.map(u => u.id));
    };

    return { users, loading, selectedIds, handleAction, toggleSelect, toggleSelectAll };
}
