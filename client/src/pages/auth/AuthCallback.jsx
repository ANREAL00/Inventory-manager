import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function AuthCallback() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const token = params.get('token');
        if (token) { localStorage.setItem('token', token); navigate('/profile'); window.location.reload(); }
        else navigate('/login');
    }, [params, navigate]);
    return <div className="p-8 text-center">Authenticating...</div>;
}
