import { useNavigate } from 'react-router-dom';

export function TagCloud({ tags = [] }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-wrap gap-2 py-4">
            {tags.map(t => (
                <button
                    key={t.id}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(t.name)}`)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 rounded-full text-sm transition-colors"
                >
                    #{t.name}
                </button>
            ))}
        </div>
    );
}
