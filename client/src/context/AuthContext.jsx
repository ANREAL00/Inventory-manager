import { createContext, useState, useEffect } from 'react';
import i18n from '../utils/i18n';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.get('/auth/me');
                if (data?.data?.user) {
                    setUser(data.data.user);
                    i18n.changeLanguage(data.data.user.language || 'en');
                    if (data.data.user.theme) {
                        window.document.documentElement.classList.remove('light', 'dark');
                        window.document.documentElement.classList.add(data.data.user.theme);
                    }
                }
            } catch (err) {
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data?.token) {
            localStorage.setItem('token', data.token);
            setUser(data.data?.user);
            i18n.changeLanguage(data.data?.user?.language || 'en');
            if (data.data?.user?.theme) {
                window.document.documentElement.classList.remove('light', 'dark');
                window.document.documentElement.classList.add(data.data.user.theme);
            }
        }
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        if (data?.token) {
            localStorage.setItem('token', data.token);
            setUser(data.data?.user);
            i18n.changeLanguage(data.data?.user?.language || 'en');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
