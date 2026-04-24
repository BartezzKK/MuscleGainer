interface ProgressBadgeProps {
    completed: number;
    total: number;
}

const ProgressBadge = ({ completed, total }: ProgressBadgeProps) => {
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

    const color =
        pct === 100
            ? 'bg-green-900 text-green-300'
            : pct >= 50
            ? 'bg-yellow-900 text-yellow-300'
            : 'bg-[#2a2a3e] text-[#94a3b8]';

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                <span>Postęp tygodnia</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
                    {completed}/{total} serii ({pct}%)
                </span>
            </div>
            <div className="w-full bg-[#2a2a3e] rounded-full h-2">
                <div
                    className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBadge;
