import { useState, useEffect } from 'react';
import api from '../../api';
import { useTranslation } from 'react-i18next';

const StatCard = ({ title, children }) => (
    <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <div className="font-bold text-lg">{children}</div>
    </div>
);

export function StatisticsView({ inventoryId }) {
    const [stats, setStats] = useState(null);
    const { t } = useTranslation();
    useEffect(() => { api.get(`/inventories/${inventoryId}/stats`).then(res => setStats(res.data.stats)); }, [inventoryId]);

    if (!stats) return <div className="text-gray-500">{t('calculating_stats')}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            <StatCard title={t('total_items')}>{stats.itemCount}</StatCard>
            {stats.fields.map((f, i) => (
                <StatCard key={i} title={f.title}>
                    {f.type === 'NUMBER' ? `${t('stat_avg')}: ${f.avg.toFixed(2)} (${t('stat_range')}: ${f.min} - ${f.max})` : `${t('stat_top')}: "${f.topValue}" (${f.frequency} ${t('stat_times')})`}
                </StatCard>
            ))}
        </div>
    );
}
