import { useMemo } from 'react';

export const useFilteredSorted = (items, search, sortKey) => {
    return useMemo(() => {
        const term = search.trim().toLowerCase();

        let result = items || [];
        if (term) {
            result = result.filter((it) => {
                return (
                    it.title?.toLowerCase().includes(term) ||
                    it.description?.toLowerCase().includes(term) ||
                    it.category?.toLowerCase().includes(term)
                );
            });
        }

        const sorted = [...result];
        switch (sortKey) {
            case 'created_asc':
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'title_asc':
                sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            case 'title_desc':
                sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
                break;
            case 'category_asc':
                sorted.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
                break;
            case 'category_desc':
                sorted.sort((a, b) => (b.category || '').localeCompare(a.category || ''));
                break;
            case 'created_desc':
            default:
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        return sorted;
    }, [items, search, sortKey]);
};

