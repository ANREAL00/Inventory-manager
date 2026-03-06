import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../api';

export function TagInput({ tags, onAdd, onRemove }) {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [allTags, setAllTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        api.get('/inventories/tags')
            .then(res => setAllTags(res.data.data.tags || []))
            .catch(err => console.error('Failed to fetch tags:', err));

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!inputValue.trim()) {
            setSuggestions([]);
            return;
        }
        const filtered = allTags
            .filter(tag =>
                tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                !tags.includes(tag.name)
            )
            .slice(0, 5);
        setSuggestions(filtered);
        setSelectedIndex(-1);
    }, [inputValue, allTags, tags]);

    const handleSelect = (tagName) => {
        onAdd(tagName);
        setInputValue('');
        setSuggestions([]);
        setIsOpen(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleSelect(suggestions[selectedIndex].name);
            } else if (inputValue.trim()) {
                handleSelect(inputValue.trim());
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            <label className="text-sm font-semibold">{t('tags_label')}</label>
            <input
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setIsOpen(true); }}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder={t('add_tag')}
            />

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {suggestions.map((tag, idx) => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleSelect(tag.name)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${idx === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
                {tags.map(t => (
                    <span key={t} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full flex items-center gap-1 animate-in zoom-in-90">
                        {t} <button type="button" onClick={() => onRemove(t)} className="hover:text-blue-900 dark:hover:text-blue-100 font-bold">×</button>
                    </span>
                ))}
            </div>
        </div>
    );
}
