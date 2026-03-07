import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import api from '../../api';

export const StringInput = ({ field, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold">{field.title}</label>
        <input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            placeholder={field.description}
        />
    </div>
);

export const NumberInput = ({ field, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold">{field.title}</label>
        <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
    </div>
);

export const BoolInput = ({ field, value, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer py-2">
        <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600"
        />
        <span className="text-sm font-medium">{field.title}</span>
    </label>
);

export const DateInput = ({ field, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold">{field.title}</label>
        <input
            type="date"
            value={value ? value.split('T')[0] : ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
    </div>
);

const ImagePreview = ({ url, onRemove }) => (
    <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-gray-50 dark:bg-gray-900 group">
        <img src={url} alt="Preview" className="w-full h-full object-cover" />
        <button type="button" onClick={onRemove} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full shadow-lg">
            <X size={14} />
        </button>
    </div>
);

const UploadPlaceholder = ({ uploading }) => (
    <div className="flex flex-col items-center justify-center py-4">
        {uploading ? <Loader2 className="w-6 h-6 text-blue-500 animate-spin" /> : <Upload className="w-6 h-6 text-gray-400" />}
        <p className="text-xs text-gray-500 mt-1 font-semibold">{uploading ? '...' : 'Upload'}</p>
    </div>
);

const useImageUpload = (onChange) => {
    const [uploading, setUploading] = useState(false);
    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            onChange(res.data.url);
        } finally { setUploading(false); }
    };
    return { uploading, handleFile };
};

export const ImageInput = ({ field, value, onChange }) => {
    const { uploading, handleFile } = useImageUpload(onChange);
    return (
        <div className="space-y-1">
            <label className="text-xs font-semibold">{field.title}</label>
            {value ? <ImagePreview url={value} onRemove={() => onChange('')} /> : (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-md cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <UploadPlaceholder uploading={uploading} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleFile} disabled={uploading} />
                </label>
            )}
        </div>
    );
};
