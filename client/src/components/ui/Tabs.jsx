export function Tabs({ tabs, activeTab, onTabChange }) {
    return (
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
