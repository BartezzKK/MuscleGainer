import { useEffect, useState } from 'react';
import type { GlobalExercise } from '../services/globalExerciseService';
import { globalExerciseService } from '../services/globalExerciseService';
import type { MuscleGroup, ExerciseType, Equipment } from '../types';
import { MUSCLE_GROUP_LABELS, EXERCISE_TYPE_LABELS, EQUIPMENT_LABELS, DIFFICULTY_LABELS } from '../types';
import CategorySelect from './CategorySelect';
import { MuscleGroup as MG, ExerciseType as ET, Equipment as EQ } from '../types';

const MUSCLE_OPTIONS = Object.values(MG)
    .filter((v): v is MuscleGroup => typeof v === 'number')
    .map((v) => ({ value: v, label: MUSCLE_GROUP_LABELS[v] }));

const TYPE_OPTIONS = Object.values(ET)
    .filter((v): v is ExerciseType => typeof v === 'number')
    .map((v) => ({ value: v, label: EXERCISE_TYPE_LABELS[v] }));

const EQUIP_OPTIONS = Object.values(EQ)
    .filter((v): v is Equipment => typeof v === 'number')
    .map((v) => ({ value: v, label: EQUIPMENT_LABELS[v] }));

interface ExerciseLibraryPickerProps {
    onPick: (exercise: GlobalExercise) => void;
    onClose: () => void;
    alreadyAdded: Set<string>; // lowercase names already in plan
}

const ExerciseLibraryPicker = ({ onPick, onClose, alreadyAdded }: ExerciseLibraryPickerProps) => {
    const [exercises, setExercises] = useState<GlobalExercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | null>(null);
    const [filterType, setFilterType] = useState<ExerciseType | null>(null);
    const [filterEquip, setFilterEquip] = useState<Equipment | null>(null);

    useEffect(() => {
        globalExerciseService.getExercises().then((data) => {
            setExercises(data);
            setLoading(false);
        });
    }, []);

    const filtered = exercises.filter((ex) => {
        if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterMuscle !== null && ex.muscleGroup !== filterMuscle) return false;
        if (filterType !== null && ex.exerciseType !== filterType) return false;
        if (filterEquip !== null && ex.equipment !== filterEquip) return false;
        return true;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div
                className="bg-[#1a1a2e] border border-[#3a3a5c] rounded-2xl p-5 w-full max-w-xl shadow-2xl max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">📚 Biblioteka ćwiczeń</h3>
                    <button onClick={onClose} className="text-[#94a3b8] hover:text-white text-xl cursor-pointer leading-none">×</button>
                </div>

                {/* Search */}
                <input
                    className="bg-[#0f0f1a] border border-[#3a3a5c] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-indigo-500 mb-3"
                    placeholder="Wyszukaj ćwiczenie..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                />

                {/* Filters */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <CategorySelect label="Partia" value={filterMuscle} options={MUSCLE_OPTIONS} onChange={setFilterMuscle} />
                    <CategorySelect label="Typ" value={filterType} options={TYPE_OPTIONS} onChange={setFilterType} />
                    <CategorySelect label="Sprzęt" value={filterEquip} options={EQUIP_OPTIONS} onChange={setFilterEquip} />
                </div>

                {/* List */}
                <div className="overflow-y-auto flex flex-col gap-1.5 pr-1">
                    {loading && <p className="text-[#94a3b8] text-sm text-center py-6">Ładowanie...</p>}
                    {!loading && filtered.length === 0 && (
                        <p className="text-[#94a3b8] text-sm text-center py-6">Brak wyników.</p>
                    )}
                    {filtered.map((ex) => {
                        const inPlan = alreadyAdded.has(ex.name.toLowerCase());
                        return (
                            <button
                                key={ex.id}
                                onClick={() => !inPlan && onPick(ex)}
                                disabled={inPlan}
                                className={`w-full text-left rounded-lg px-3 py-2.5 border transition-colors flex items-center justify-between gap-2
                                    ${inPlan
                                        ? 'border-[#2a2a3e] opacity-40 cursor-not-allowed'
                                        : 'border-[#3a3a5c] hover:border-indigo-500 hover:bg-indigo-950/20 cursor-pointer'
                                    }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <span className="text-white text-sm font-medium block truncate">{ex.name}</span>
                                    <div className="flex gap-1.5 flex-wrap mt-0.5">
                                        {ex.muscleGroup !== null && (
                                            <span className="text-xs text-indigo-300">{MUSCLE_GROUP_LABELS[ex.muscleGroup!]}</span>
                                        )}
                                        {ex.exerciseType !== null && (
                                            <span className="text-xs text-[#94a3b8]">· {EXERCISE_TYPE_LABELS[ex.exerciseType!]}</span>
                                        )}
                                        {ex.equipment !== null && (
                                            <span className="text-xs text-[#94a3b8]">· {EQUIPMENT_LABELS[ex.equipment!]}</span>
                                        )}
                                        {ex.difficulty !== null && (
                                            <span className="text-xs text-[#94a3b8]">· {DIFFICULTY_LABELS[ex.difficulty!]}</span>
                                        )}
                                    </div>
                                </div>
                                {inPlan ? (
                                    <span className="text-xs text-[#555] flex-shrink-0">już w planie</span>
                                ) : (
                                    <span className="text-xs text-indigo-400 flex-shrink-0">+ Dodaj</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <p className="text-xs text-[#555] mt-3 text-center">
                    Kliknij ćwiczenie, aby wypełnić formularz. Możesz zmienić dane przed dodaniem.
                </p>
            </div>
        </div>
    );
};

export default ExerciseLibraryPicker;
