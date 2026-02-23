import { useState } from 'react';
import { useComments } from '../../hooks/useComments';
import ReactMarkdown from 'react-markdown';

const Comment = ({ comment }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
        <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-sm text-blue-600">{comment.user.name}</span>
            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{comment.content}</ReactMarkdown>
        </div>
    </div>
);

export function DiscussionView({ inventoryId }) {
    const { comments, postComment } = useComments(inventoryId);
    const [text, setText] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        if (text.trim()) { await postComment(text); setText(''); }
    };

    return (
        <div className="space-y-4 max-w-3xl">
            <div className="space-y-4">{comments.map(c => <Comment key={c.id} comment={c} />)}</div>
            <form onSubmit={submit} className="space-y-2">
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-800" placeholder="Write a comment..." rows={3} />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-bold">Post Comment</button>
            </form>
        </div>
    );
}
