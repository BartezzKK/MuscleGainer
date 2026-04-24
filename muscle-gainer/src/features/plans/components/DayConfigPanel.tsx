import { useState } from 'react';
import type { PlanDay, PlanExercise, PlanDayExercise } from '../types';
import {
    MuscleGroup, ExerciseType, Equipment,
    MUSCLE_GROUP_LABELS, EXERCISE_TYPE_LABELS, EQUIPMENT_LABELS,
} from '../types';
import { planService } from '../services/planService';
import CategorySelect from './CategorySelect';

const MUSCLE_OPTIONS = Object.values(MuscleGroup)
    .filter((v): v is MuscleGroup => typeof v === 'number')
    .map((v) => ({ value: v, label: MUSCLE_GROUP_LABELS[v] }));

const TYPE_OPTIONS = Object.values(ExerciseType)
    .filter((v): v is ExerciseType => typeof v === 'number')
    .map((v) => ({ value: v, label: EXERCISE_TYPE_LABELS[v] }));

const EQUIP_OPTIONS = Object.values(Equipment)
    .filter((v): v is Equipment => typeof v === 'number')
    .map((v) => ({ value: v, label: EQUIPMENT_LABELS[v] }));

const DAY_NAMES = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

interface DayConfigPanelProps {
    planId: number;
    day: PlanDay;
    allExercises: PlanExercise[];
    onClose: () => void;
    onChanged: () => void;
}

const DayConfigPanel = ({ planId, day, allExercises, onClose, onChanged }: DayConfigPanelProps) => {
    const [saving, setSaving] = useState(false);
    const [sets, setSets] = useState<Record<number, number>>({});
    const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | null>(null);
    const [filterType, setFilterType] = useState<ExerciseType | null>(null);
    const [filterEquip, setFilterEquip] = useState<Equipment | null>(null);

    const filteredExercises = allExercises.filter((ex) => {
        if (filterMuscle !== null && ex.muscleGroup !== filterMuscle) return false;
        if (filterType !== null && ex.exerciseType !== filterType) return false;
        if (filterEquip !== null && ex.equipment !== filterEquip) return false;
        return true;
    });

    const assignedIds = new Set(day.exercises.map((e) => e.planExerciseId));

    const getSets = (ex: PlanDayExercise | undefined, planEx: PlanExercise) =>
        sets[planEx.id] ?? ex?.sets ?? planEx.defaultSets;

    const handleToggleRestDay = async () => {
        setSaving(true);
        try {
            await planService.updateDay(planId, day.id, { isRestDay: !day.isRestDay });
            onChanged();
        } finally {
            setSaving(false);
        }
    };

    const handleAssign = async (planExercise: PlanExercise) => {
        const s = getSets(undefined, planExercise);
        setSaving(true);
        try {
            await planService.assignExerciseToDay(planId, day.id, {
                planExerciseId: planExercise.id,
                sets: s,
            });
            onChanged();
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async (pde: PlanDayExercise) => {
        setSaving(true);
        try {
            await planService.removeExerciseFromDay(planId, day.id, pde.id);
            onChanged();
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateSets = async (pde: PlanDayExercise, planEx: PlanExercise) => {
        const s = getSets(pde, planEx);
        setSaving(true);
        try {
            await planService.assignExerciseToDay(planId, day.id, {
                planExerciseId: planEx.id,
                sets: s,
            });
            onChanged();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div
                className="bg-[#1a1a2e] border border-[#3a3a5c] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{DAY_NAMES[day.dayOfWeek]}</h3>
                    <button onClick={onClose} className="text-[#94a3b8] hover:text-white text-xl cursor-pointer leading-none">×</button>
                </div>

                {/* Rest day toggle */}
                <label className="flex items-center gap-3 mb-4 cursor-pointer select-none">
                    <div
                        className={`w-10 h-5 rounded-full transition-colors ${day.isRestDay ? 'bg-indigo-600' : 'bg-[#3a3a5c]'}`}
                        onClick={handleToggleRestDay}
                    >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${day.isRestDay ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm text-[#94a3b8]">Dzień wolny</span>
                </label>

                {!day.isRestDay && (
                    <>
                        {/* Filters */}
                        {allExercises.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <CategorySelect label="Partia" value={filterMuscle} options={MUSCLE_OPTIONS} onChange={setFilterMuscle} />
                                <CategorySelect label="Typ" value={filterType} options={TYPE_OPTIONS} onChange={setFilterType} />
                                <CategorySelect label="Sprzęt" value={filterEquip} options={EQUIP_OPTIONS} onChange={setFilterEquip} />
                            </div>
                        )}

                        {allExercises.length === 0 && (
                            <p className="text-[#94a3b8] text-sm mb-3">Brak ćwiczeń w planie. Dodaj ćwiczenia najpierw.</p>
                        )}
                        {allExercises.length > 0 && filteredExercises.length === 0 && (
                            <p className="text-[#94a3b8] text-sm mb-3">Brak ćwiczeń spełniających filtry.</p>
                        )}
                        <div className="flex flex-col gap-2">
                            {filteredExercises.map((planEx) => {
                                const pde = day.exercises.find((e) => e.planExerciseId === planEx.id);
                                const assigned = assignedIds.has(planEx.id);
                                return (
                                    <div key={planEx.id} className={`flex items-center justify-between rounded-lg px-3 py-2 border transition-colors ${assigned ? 'border-indigo-500 bg-indigo-950/30' : 'border-[#3a3a5c]'}`}>
                                        <span className="text-sm text-white">{planEx.name}</span>
                                        <div className="flex items-center gap-2">
                                            {assigned && pde && (
                                                <>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={20}
                                                        className="w-14 bg-[#0f0f1a] border border-[#3a3a5c] rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-indigo-500"
                                                        value={getSets(pde, planEx)}
                                                        onChange={(e) => setSets((prev) => ({ ...prev, [planEx.id]: Number(e.target.value) }))}
                                                        onBlur={() => handleUpdateSets(pde, planEx)}
                                                        title="Liczba serii"
                                                    />
                                                    <span className="text-xs text-[#94a3b8]">serii</span>
                                                    <button
                                                        onClick={() => handleRemove(pde)}
                                                        disabled={saving}
                                                        className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                                                    >
                                                        Usuń
                                                    </button>
                                                </>
                                            )}
                                            {!assigned && (
                                                <>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={20}
                                                        className="w-14 bg-[#0f0f1a] border border-[#3a3a5c] rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-indigo-500"
                                                        value={getSets(undefined, planEx)}
                                                        onChange={(e) => setSets((prev) => ({ ...prev, [planEx.id]: Number(e.target.value) }))}
                                                        title="Liczba serii"
                                                    />
                                                    <span className="text-xs text-[#94a3b8]">serii</span>
                                                    <button
                                                        onClick={() => handleAssign(planEx)}
                                                        disabled={saving}
                                                        className="text-indigo-400 hover:text-indigo-300 text-xs cursor-pointer"
                                                    >
                                                        Dodaj
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DayConfigPanel;
