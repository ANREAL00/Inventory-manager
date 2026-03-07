import { useState, useEffect } from 'react';
import api from '../api';

export function useUserProfile(userId) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        api.get(`/users/${userId}/profile`)
            .then(res => setUser(res.data.data.user))
            .catch(err => setError(err.response?.data?.message || 'Error fetching profile'))
            .finally(() => setLoading(false));
    }, [userId]);

    return { user, loading, error };
}
