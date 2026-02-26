import { useState, useEffect } from 'react';
import api from '../../api';
import { UserMinus, UserPlus, Search } from 'lucide-react';

export function AccessSettingsView({ isPublic, authorizedUsers, onChange }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const timer = query.length > 1 && setTimeout(() => api.get(`/users/search?q=${query}`).then(res => setResults(res.data.users)), 300);
        return () => clearTimeout(timer);
    }, [query]);

    const addUser = (u) => !authorizedUsers.find(au => au.id === u.id) && (onChange({ authorizedUsers: [...authorizedUsers, u] }), setQuery(''), setResults([]));
    const removeUser = (id) => onChange({ authorizedUsers: authorizedUsers.filter(u => u.id !== id) });

    return (
        <div className="space-y-8 max-w-2xl">
            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <input type="checkbox" checked={isPublic} onChange={(e) => onChange({ isPublic: e.target.checked })} className="w-5 h-5 rounded border-gray-300" />
                <div><p className="font-bold">Public Inventory</p><p className="text-sm text-gray-500">Anyone can view and add items</p></div>
            </label>

            {!isPublic && (
                <div className="space-y-4">
                    <h3 className="font-bold border-b pb-2">Users with Access</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-800" placeholder="Type name or email to add..." />
                        {results.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-950 border rounded-lg shadow-xl overflow-hidden">
                                {results.map(u => <button key={u.id} onClick={() => addUser(u)} className="w-full text-left p-3 hover:bg-gray-100 flex justify-between items-center text-sm"><span>{u.name} ({u.email})</span><UserPlus size={16} /></button>)}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">{authorizedUsers.map(u => <div key={u.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"><span className="text-sm">{u.name} ({u.email})</span><button onClick={() => removeUser(u.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><UserMinus size={16} /></button></div>)}</div>
                </div>
            )}
        </div>
    );
}
