import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import api from '../../../api';

const categories = ['Equipment', 'Furniture', 'Book', 'Other'];

export function CategoryImageStep({ data, update }) {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            update({ imageUrl: res.data.url });
        } catch (err) {
            console.error('Upload failed:', err);
            alert(t('err_upload_failed') || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold">{t('label_category')}</label>
                <select
                    value={data.category || ''}
                    onChange={(e) => update({ category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                >
                    <option value="" disabled>{t('select_category') || 'Select Category'}</option>
                    {categories.map(c => (
                        <option key={c} value={c}>{t(`cat_${c.toLowerCase()}`)}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold">{t('label_illustration')}</label>
                <div className="flex flex-col gap-4">
                    {data.imageUrl ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-gray-50 dark:bg-gray-900 group">
                            <img src={data.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => update({ imageUrl: '' })}
                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className={`
                            flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer
                            transition-all hover:bg-gray-50 dark:hover:bg-gray-900
                            ${uploading ? 'bg-gray-50 dark:bg-gray-900 border-blue-400' : 'border-gray-200 dark:border-gray-800'}
                        `}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-10 h-10 mb-3 text-blue-500 animate-spin" />
                                        <p className="text-sm text-gray-500">{t('processing')}</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">{t('click_to_upload') || 'Click to upload'}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
                                    </>
                                )}
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
}
