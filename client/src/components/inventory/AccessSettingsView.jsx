import { useState, useEffect } from 'react';
import api from '../../api';
import { UserMinus, UserPlus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AccessSettingsView({ isPublic, authorizedUsers = [], onChange }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [sortBy, setSortBy] = useState('name'); // 'name' or 'email'
    const { t } = useTranslation();

    useEffect(() => {
        const timer = query.length > 1 && setTimeout(() => api.get(`/users/search?q=${query}`).then(res => setResults(res.data.users)), 300);
        return () => clearTimeout(timer);
    }, [query]);

    const addUser = (u) => !authorizedUsers.find(au => au.id === u.id) && (onChange({ authorizedUsers: [...authorizedUsers, u] }), setQuery(''), setResults([]));
    const removeUser = (id) => onChange({ authorizedUsers: authorizedUsers.filter(u => u.id !== id) });

    const sortedUsers = [...authorizedUsers].sort((a, b) => (a[sortBy] || '').localeCompare(b[sortBy] || ''));

    return (
        <div className="space-y-8 max-w-2xl">
            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <input type="checkbox" checked={isPublic} onChange={(e) => onChange({ isPublic: e.target.checked })} className="w-5 h-5 rounded border-gray-300" />
                <div><p className="font-bold">{t('label_public')}</p><p className="text-sm text-gray-500">{t('desc_public')}</p></div>
            </label>

            {!isPublic && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-bold">{t('title_access')} ({authorizedUsers.length})</h3>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500">{t('label_sort_by')}:</span>
                            <button onClick={() => setSortBy('name')} className={`px-2 py-1 rounded ${sortBy === 'name' ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100'}`}>{t('sort_name')}</button>
                            <button onClick={() => setSortBy('email')} className={`px-2 py-1 rounded ${sortBy === 'email' ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100'}`}>{t('sort_email')}</button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-800" placeholder={t('placeholder_user_search')} />
                        {results.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-950 border rounded-lg shadow-xl overflow-hidden">
                                {results.map(u => <button key={u.id} onClick={() => addUser(u)} className="w-full text-left p-3 hover:bg-gray-100 flex justify-between items-center text-sm"><span>{u.name} ({u.email})</span><UserPlus size={16} /></button>)}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        {sortedUsers.map(u => (
                            <div key={u.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 animate-in fade-in slide-in-from-left-2 duration-200">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{u.name}</span>
                                    <span className="text-xs text-gray-500">{u.email}</span>
                                </div>
                                <button onClick={() => removeUser(u.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><UserMinus size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
