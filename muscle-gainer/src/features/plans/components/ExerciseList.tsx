import { useState } from 'react';
import type { PlanExercise } from '../types';
import {
    MuscleGroup, ExerciseType, Equipment, Difficulty,
    MUSCLE_GROUP_LABELS, EXERCISE_TYPE_LABELS, EQUIPMENT_LABELS, DIFFICULTY_LABELS,
} from '../types';
import { planService } from '../services/planService';
import type { GlobalExercise } from '../services/globalExerciseService';
import CategorySelect from './CategorySelect';
import ExerciseLibraryPicker from './ExerciseLibraryPicker';

const MUSCLE_OPTIONS = Object.values(MuscleGroup)
    .filter((v): v is MuscleGroup => typeof v === 'number')
    .map((v) => ({ value: v, label: MUSCLE_GROUP_LABELS[v] }));

const TYPE_OPTIONS = Object.values(ExerciseType)
    .filter((v): v is ExerciseType => typeof v === 'number')
    .map((v) => ({ value: v, label: EXERCISE_TYPE_LABELS[v] }));

const EQUIP_OPTIONS = Object.values(Equipment)
    .filter((v): v is Equipment => typeof v === 'number')
    .map((v) => ({ value: v, label: EQUIPMENT_LABELS[v] }));

const DIFF_OPTIONS = Object.values(Difficulty)
    .filter((v): v is Difficulty => typeof v === 'number')
    .map((v) => ({ value: v, label: DIFFICULTY_LABELS[v] }));

const DIFF_COLORS: Record<Difficulty, string> = {
    [Difficulty.Poczatkujacy]: 'bg-green-900 text-green-300',
    [Difficulty.Srednio]: 'bg-yellow-900 text-yellow-300',
    [Difficulty.Zaawansowany]: 'bg-red-900 text-red-300',
};

interface ExerciseFormState {
    name: string;
    defaultSets: number;
    muscleGroup: MuscleGroup | null;
    exerciseType: ExerciseType | null;
    equipment: Equipment | null;
    difficulty: Difficulty | null;
}

const emptyForm = (): ExerciseFormState => ({
    name: '',
    defaultSets: 3,
    muscleGroup: null,
    exerciseType: null,
    equipment: null,
    difficulty: null,
});

interface ExerciseListProps {
    planId: number;
    exercises: PlanExercise[];
    onChanged: () => void;
}

const ExerciseList = ({ planId, exercises, onChanged }: ExerciseListProps) => {
    const [form, setForm] = useState<ExerciseFormState>(emptyForm());
    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<ExerciseFormState>(emptyForm());
    const [error, setError] = useState('');
    const [showLibrary, setShowLibrary] = useState(false);

    const handlePickFromLibrary = (ex: GlobalExercise) => {
        setForm({
            name: ex.name,
            defaultSets: 3,
            muscleGroup: ex.muscleGroup,
            exerciseType: ex.exerciseType,
            equipment: ex.equipment,
            difficulty: ex.difficulty,
        });
        setShowLibrary(false);
    };

    const alreadyAdded = new Set(exercises.map((e) => e.name.toLowerCase()));

    const handleAdd = async () => {
        if (!form.name.trim()) return;
        try {
            await planService.addExercise(planId, {
                name: form.name.trim(),
                defaultSets: form.defaultSets,
                muscleGroup: form.muscleGroup,
                exerciseType: form.exerciseType,
                equipment: form.equipment,
                difficulty: form.difficulty,
            });
            setForm(emptyForm());
            onChanged();
        } catch {
            setError('Błąd podczas dodawania ćwiczenia.');
        }
    };

    const startEdit = (ex: PlanExercise) => {
        setEditId(ex.id);
        setEditForm({
            name: ex.name,
            defaultSets: ex.defaultSets,
            muscleGroup: ex.muscleGroup,
            exerciseType: ex.exerciseType,
            equipment: ex.equipment,
            difficulty: ex.difficulty,
        });
    };

    const handleUpdate = async (id: number) => {
        try {
            await planService.updateExercise(planId, id, {
                name: editForm.name,
                defaultSets: editForm.defaultSets,
                muscleGroup: editForm.muscleGroup,
                exerciseType: editForm.exerciseType,
                equipment: editForm.equipment,
                difficulty: editForm.difficulty,
            });
            setEditId(null);
            onChanged();
        } catch {
            setError('Błąd podczas aktualizacji.');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await planService.deleteExercise(planId, id);
            onChanged();
        } catch {
            setError('Błąd podczas usuwania ćwiczenia.');
        }
    };

    return (
        <div>
            <h3 className="text-base font-semibold text-white mb-4">Ćwiczenia w planie</h3>
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

            {/* Add form */}
            <div className="border border-dashed border-[#3a3a5c] rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-[#94a3b8] font-semibold uppercase tracking-wide">Nowe ćwiczenie</p>
                    <button
                        onClick={() => setShowLibrary(true)}
                        className="text-xs px-3 py-1 rounded-lg border border-indigo-700 text-indigo-400 hover:border-indigo-500 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                        📚 Wybierz z biblioteki
                    </button>
                </div>
                <div className="flex gap-2 mb-2">
                    <input
                        className="flex-1 bg-[#1a1a2e] border border-[#3a3a5c] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Nazwa ćwiczenia"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            min={1}
                            max={20}
                            className="w-16 bg-[#1a1a2e] border border-[#3a3a5c] rounded-lg px-2 py-2 text-sm text-white text-center focus:outline-none focus:border-indigo-500"
                            title="Domyślna liczba serii"
                            value={form.defaultSets}
                            onChange={(e) => setForm((f) => ({ ...f, defaultSets: Number(e.target.value) }))}
                        />
                        <span className="text-xs text-[#94a3b8]">serii</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 sm:grid-cols-4">
                    <CategorySelect label="Partia mięśniowa" value={form.muscleGroup} options={MUSCLE_OPTIONS} onChange={(v) => setForm((f) => ({ ...f, muscleGroup: v }))} />
                    <CategorySelect label="Typ ćwiczenia" value={form.exerciseType} options={TYPE_OPTIONS} onChange={(v) => setForm((f) => ({ ...f, exerciseType: v }))} />
                    <CategorySelect label="Sprzęt" value={form.equipment} options={EQUIP_OPTIONS} onChange={(v) => setForm((f) => ({ ...f, equipment: v }))} />
                    <CategorySelect label="Poziom" value={form.difficulty} options={DIFF_OPTIONS} onChange={(v) => setForm((f) => ({ ...f, difficulty: v }))} />
                </div>
                <button
                    onClick={handleAdd}
                    disabled={!form.name.trim()}
                    className="px-5 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold transition-colors cursor-pointer"
                >
                    Dodaj ćwiczenie
                </button>
            </div>

            {exercises.length === 0 && (
                <p className="text-[#94a3b8] text-sm">Brak ćwiczeń. Dodaj pierwsze ćwiczenie do planu.</p>
            )}

            <div className="flex flex-col gap-2">
                {exercises.map((ex) =>
                    editId === ex.id ? (
                        <div key={ex.id} className="border border-indigo-500 rounded-xl p-3">
                            <div className="flex gap-2 mb-2">
                                <input
                                    className="flex-1 bg-[#1a1a2e] border border-[#3a3a5c] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                                />
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        className="w-16 bg-[#1a1a2e] border border-[#3a3a5c] rounded-lg px-2 py-2 text-sm text-white text-center focus:outline-none"
                                        value={editForm.defaultSets}
                                        onChange={(e) => setEditForm((f) => ({ ...f, defaultSets: Number(e.target.value) }))}
                                    />
                                    <span className="text-xs text-[#94a3b8]">serii</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3 sm:grid-cols-4">
                                <CategorySelect label="Partia mięśniowa" value={editForm.muscleGroup} options={MUSCLE_OPTIONS} onChange={(v) => setEditForm((f) => ({ ...f, muscleGroup: v }))} />
                                <CategorySelect label="Typ ćwiczenia" value={editForm.exerciseType} options={TYPE_OPTIONS} onChange={(v) => setEditForm((f) => ({ ...f, exerciseType: v }))} />
                                <CategorySelect label="Sprzęt" value={editForm.equipment} options={EQUIP_OPTIONS} onChange={(v) => setEditForm((f) => ({ ...f, equipment: v }))} />
                                <CategorySelect label="Poziom" value={editForm.difficulty} options={DIFF_OPTIONS} onChange={(v) => setEditForm((f) => ({ ...f, difficulty: v }))} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleUpdate(ex.id)} className="text-green-400 hover:text-green-300 text-sm cursor-pointer">Zapisz</button>
                                <button onClick={() => setEditId(null)} className="text-[#94a3b8] hover:text-white text-sm cursor-pointer">Anuluj</button>
                            </div>
                        </div>
                    ) : (
                        <div key={ex.id} className="flex items-center justify-between border border-[#3a3a5c] rounded-xl px-4 py-3 hover:border-[#4a4a6c] transition-colors">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-white text-sm font-medium">{ex.name}</span>
                                    <span className="text-xs text-[#94a3b8]">{ex.defaultSets} serie</span>
                                    {ex.muscleGroup !== null && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900 text-indigo-300">{MUSCLE_GROUP_LABELS[ex.muscleGroup!]}</span>
                                    )}
                                    {ex.exerciseType !== null && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a3e] text-[#94a3b8]">{EXERCISE_TYPE_LABELS[ex.exerciseType!]}</span>
                                    )}
                                    {ex.equipment !== null && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a3e] text-[#94a3b8]">{EQUIPMENT_LABELS[ex.equipment!]}</span>
                                    )}
                                    {ex.difficulty !== null && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${DIFF_COLORS[ex.difficulty!]}`}>{DIFFICULTY_LABELS[ex.difficulty!]}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 ml-4 flex-shrink-0">
                                <button onClick={() => startEdit(ex)} className="text-[#94a3b8] hover:text-white text-xs cursor-pointer">Edytuj</button>
                                <button onClick={() => handleDelete(ex.id)} className="text-red-500 hover:text-red-400 text-xs cursor-pointer">Usuń</button>
                            </div>
                        </div>
                    )
                )}
            </div>

            {showLibrary && (
                <ExerciseLibraryPicker
                    onPick={handlePickFromLibrary}
                    onClose={() => setShowLibrary(false)}
                    alreadyAdded={alreadyAdded}
                />
            )}
        </div>
    );
};

export default ExerciseList;



