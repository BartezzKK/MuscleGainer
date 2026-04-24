import { useNavigate } from 'react-router-dom';
import type { RecentWorkoutDTO } from '../types';

interface Props {
    workouts: RecentWorkoutDTO[];
}

const RecentWorkouts = ({ workouts }: Props) => {
    const navigate = useNavigate();

    if (workouts.length === 0) {
        return (
            <div className="bg-[#1a1a2e] border border-[#3a3a5c] rounded-2xl p-6 text-[#94a3b8] text-sm">
                Brak ostatnich treningów.
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a2e] border border-[#3a3a5c] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#3a3a5c]">
                <h3 className="text-base font-semibold text-white">Ostatnie treningi</h3>
            </div>
            <ul>
                {workouts.map((w, i) => (
                    <li
                        key={w.id}
                        onClick={() => navigate(`/workouts/${w.id}`)}
                        className={`flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[#252540] transition-colors ${i !== workouts.length - 1 ? 'border-b border-[#3a3a5c]' : ''}`}
                    >
                        <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-white">{w.name}</span>
                            <span className="text-xs text-[#94a3b8]">
                                {new Date(w.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex gap-6 text-sm text-[#94a3b8]">
                            <span>{w.exerciseCount} ćw.</span>
                            <span>{w.setCount} serii</span>
                            <span className="text-[#34d399] font-semibold">{w.volume.toFixed(0)} kg</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentWorkouts;
