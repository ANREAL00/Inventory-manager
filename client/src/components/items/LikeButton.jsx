import { Heart } from 'lucide-react';
import { useLikes } from '../../hooks/useLikes';
import { useAuth } from '../../hooks/useAuth';

export function LikeButton({ itemId }) {
    const { user } = useAuth();
    const { likes, toggle } = useLikes(itemId);
    const isLiked = likes.some(l => l.userId === user?.id);

    return (
        <button onClick={toggle} className="flex items-center gap-1.5 group">
            <Heart size={18} className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-400'}`} />
            <span className="text-sm font-medium text-gray-500">{likes.length}</span>
        </button>
    );
}
