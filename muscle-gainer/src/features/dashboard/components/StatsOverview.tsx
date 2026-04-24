import type { DashboardDTO } from '../types';

interface Props {
    stats: DashboardDTO;
}

const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
    <div className="bg-[#1a1a2e] border border-[#3a3a5c] rounded-2xl p-6 flex flex-col gap-1">
        <span className="text-sm font-medium text-[#94a3b8]">{label}</span>
        <span className="text-3xl font-bold text-white">{value}</span>
        {sub && <span className="text-xs text-[#94a3b8]">{sub}</span>}
    </div>
);

const StatsOverview = ({ stats }: Props) => {
    const volume = stats.totalVolume >= 1000
        ? `${(stats.totalVolume / 1000).toFixed(1)}t`
        : `${stats.totalVolume.toFixed(0)} kg`;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Treningi" value={stats.totalWorkouts} sub="łącznie" />
            <StatCard label="Ćwiczenia" value={stats.totalExercises} sub="łącznie" />
            <StatCard label="Serie" value={stats.totalSets} sub="łącznie" />
            <StatCard label="Objętość" value={volume} sub="waga × powtórzenia" />
        </div>
    );
};

export default StatsOverview;
