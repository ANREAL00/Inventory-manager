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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const updateUserInState = (updatedUser) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const removeUserFromState = (id) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    const handleAction = async (action, method = 'patch') => {
        try {
            await Promise.all(selectedIds.map(id => api[method](`/ users / ${id}/${action}`)));
            await fetchUsers();
            setSelectedIds([]);
        } catch (err) {
            alert(err.response?.data?.message || 'Bulk action failed');
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
