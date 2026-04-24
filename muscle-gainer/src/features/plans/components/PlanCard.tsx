import { useNavigate } from 'react-router-dom';
import type { Plan } from '../types';

interface PlanCardProps {
    plan: Plan;
    onDelete: (id: number) => void;
}

const PlanCard = ({ plan, onDelete }: PlanCardProps) => {
    const navigate = useNavigate();

    return (
        <div className="border border-[#3a3a5c] rounded-xl p-5 flex justify-between items-center hover:border-indigo-500 transition-colors">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    {plan.isActive ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-900 text-green-300">aktywny</span>
                    ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a3e] text-[#94a3b8]">nieaktywny</span>
                    )}
                </div>
                <p className="text-xs text-[#94a3b8]">
                    Utworzono: {new Date(plan.createdAt).toLocaleDateString('pl-PL')}
                </p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => navigate(`/plans/${plan.id}/week`)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors cursor-pointer"
                >
                    Ten tydzień
                </button>
                <button
                    onClick={() => navigate(`/plans/${plan.id}`)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-[#3a3a5c] text-[#94a3b8] hover:text-white hover:border-indigo-500 transition-colors cursor-pointer"
                >
                    Edytuj
                </button>
                <button
                    onClick={() => onDelete(plan.id)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-red-800 text-red-400 hover:border-red-500 hover:text-red-300 transition-colors cursor-pointer"
                >
                    Usuń
                </button>
            </div>
        </div>
    );
};

export default PlanCard;
