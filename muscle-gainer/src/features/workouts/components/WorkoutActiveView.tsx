import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WorkoutDTO, ExerciseDTO } from '../types';
import AddSetForm from './AddSetForm';
import AddExerciseForm from './AddExerciseForm';

// ─── Stopwatch ────────────────────────────────────────────────────────────────
const Stopwatch = () => {
    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0); // ms
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);

    const start = useCallback(() => {
        startTimeRef.current = Date.now() - elapsed;
        intervalRef.current = setInterval(() => {
            setElapsed(Date.now() - startTimeRef.current);
        }, 100);
        setRunning(true);
    }, [elapsed]);

    const pause = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
    }, []);

    const reset = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        setElapsed(0);
    }, []);

    useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

    const totalSec = Math.floor(elapsed / 1000);
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    const centis = String(Math.floor((elapsed % 1000) / 10)).padStart(2, '0');

    return (
        <div className="border border-[#3a3a5c] rounded-xl p-4 text-center select-none">
            <p className="text-xs text-[#94a3b8] mb-2 font-medium uppercase tracking-wider">
                Stoper — przerwa między seriami
            </p>
            <div className="font-mono text-4xl font-bold text-white mb-4 tracking-wider">
                {mins}:{secs}
                <span className="text-xl text-[#94a3b8]">.{centis}</span>
            </div>
            <div className="flex justify-center gap-3">
                <button
                    onClick={running ? pause : start}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer
                        ${running
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                    {running ? '⏸ Pauza' : elapsed > 0 ? '▶ Wznów' : '▶ Start'}
                </button>
                <button
                    onClick={reset}
                    className="px-5 py-2 rounded-lg font-semibold text-sm bg-[#252540] hover:bg-[#2e2e50] 
                               text-[#94a3b8] hover:text-white transition-colors cursor-pointer border border-[#3a3a5c]"
                >
                    ↺ Reset
                </button>
            </div>
        </div>
    );
};

// ─── Exercise Slide ───────────────────────────────────────────────────────────
interface ExerciseSlideProps {
    exercise: ExerciseDTO;
    index: number;
    total: number;
    onSetAdded: () => void;
}

const ExerciseSlide = ({ exercise, index, total, onSetAdded }: ExerciseSlideProps) => {
    const lastSet = exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1] : null;

    return (
        <div className="flex flex-col gap-5">
            {/* Exercise header */}
            <div className="border border-indigo-700/60 bg-indigo-950/20 rounded-xl p-5">
                <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        Ćwiczenie {index + 1} / {total}
                    </span>
                    <span className="text-xs text-[#94a3b8]">
                        {exercise.sets.length} {exercise.sets.length === 1 ? 'seria' : 
                         exercise.sets.length < 5 ? 'serie' : 'serii'} wykonane
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">{exercise.name}</h2>
            </div>

            {/* Sets table */}
            {exercise.sets.length > 0 ? (
                <div className="border border-[#3a3a5c] rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#1e1e30] text-[#94a3b8] text-xs uppercase tracking-wider">
                                <th className="px-4 py-3 text-center">#</th>
                                <th className="px-4 py-3 text-center">Powtórzenia</th>
                                <th className="px-4 py-3 text-center">Waga (kg)</th>
                                <th className="px-4 py-3 text-center">Objętość</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercise.sets.map((set) => (
                                <tr
                                    key={set.id}
                                    className="border-t border-[#3a3a5c] hover:bg-[#1e1e30] transition-colors"
                                >
                                    <td className="px-4 py-3 text-center">
                                        <span className="w-7 h-7 inline-flex items-center justify-center 
                                                         rounded-full bg-indigo-700/30 text-indigo-300 
                                                         text-xs font-bold">
                                            {set.order}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-white font-semibold text-base">
                                        {set.reps}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-white font-semibold text-base">{set.weight}</span>
                                        <span className="text-[#94a3b8] text-xs ml-1">kg</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-[#94a3b8] text-sm">
                                        {(set.reps * set.weight).toFixed(1)} kg
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {exercise.sets.length > 1 && (
                            <tfoot>
                                <tr className="border-t border-[#3a3a5c] bg-[#1e1e30]">
                                    <td colSpan={3} className="px-4 py-2 text-xs text-[#94a3b8] text-right">
                                        Łączna objętość:
                                    </td>
                                    <td className="px-4 py-2 text-center text-indigo-300 font-semibold text-sm">
                                        {exercise.sets.reduce((sum, s) => sum + s.reps * s.weight, 0).toFixed(1)} kg
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            ) : (
                <div className="border border-dashed border-[#3a3a5c] rounded-xl p-6 text-center text-[#94a3b8] text-sm">
                    Brak serii. Dodaj pierwszą serię poniżej.
                </div>
            )}

            {/* Add set */}
            <AddSetForm
                exerciseId={exercise.id}
                nextOrder={exercise.sets.length + 1}
                onSetAdded={onSetAdded}
                defaultReps={lastSet?.reps}
                defaultWeight={lastSet?.weight}
            />

            {/* Stopwatch */}
            <Stopwatch />
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
interface WorkoutActiveViewProps {
    workout: WorkoutDTO;
    onExerciseAdded: () => void;
    onSetAdded: () => void;
}

const WorkoutActiveView = ({ workout, onExerciseAdded, onSetAdded }: WorkoutActiveViewProps) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [finished, setFinished] = useState(false);

    const exercises = workout.exercises;
    const safeIndex = Math.min(currentIndex, Math.max(exercises.length - 1, 0));
    const isLastExercise = safeIndex === exercises.length - 1;

    const goTo = (idx: number) => setCurrentIndex(Math.max(0, Math.min(idx, exercises.length - 1)));

    const formattedDate = new Date(workout.date).toLocaleDateString('pl-PL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Workout header */}
            <div>
                <h1 className="text-2xl font-bold text-white">{workout.name}</h1>
                <p className="text-[#94a3b8] text-sm mt-1 capitalize">{formattedDate}</p>
                {workout.planName && (
                    <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full 
                                    bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 text-xs font-medium">
                        <span>📋</span>
                        <span>Plan: {workout.planName}</span>
                    </div>
                )}
            </div>

            {exercises.length === 0 ? (
                <div className="border border-dashed border-[#3a3a5c] rounded-xl p-10 text-center">
                    <p className="text-[#94a3b8] text-sm mb-4">Brak ćwiczeń. Dodaj pierwsze! 💪</p>
                </div>
            ) : (
                <>
                    {/* Dot navigation */}
                    <div className="flex items-center justify-center gap-2">
                        {exercises.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`rounded-full transition-all cursor-pointer
                                    ${i === safeIndex
                                        ? 'w-6 h-2.5 bg-indigo-500'
                                        : 'w-2.5 h-2.5 bg-[#3a3a5c] hover:bg-[#5a5a7c]'}`}
                            />
                        ))}
                    </div>

                    {/* Slide */}
                    <ExerciseSlide
                        key={safeIndex}
                        exercise={exercises[safeIndex]}
                        index={safeIndex}
                        total={exercises.length}
                        onSetAdded={onSetAdded}
                    />

                    {/* Prev / Next / Finish */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => goTo(safeIndex - 1)}
                            disabled={safeIndex === 0}
                            className="flex-1 py-3 rounded-lg border border-[#3a3a5c] text-white font-medium 
                                       text-sm hover:border-indigo-500 hover:bg-[#1e1e30] transition-all 
                                       cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Poprzednie
                        </button>
                        {isLastExercise ? (
                            <button
                                onClick={() => setFinished(true)}
                                className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white 
                                           font-semibold text-sm transition-all cursor-pointer"
                            >
                                ✓ Zakończ trening
                            </button>
                        ) : (
                            <button
                                onClick={() => goTo(safeIndex + 1)}
                                className="flex-1 py-3 rounded-lg border border-[#3a3a5c] text-white font-medium 
                                           text-sm hover:border-indigo-500 hover:bg-[#1e1e30] transition-all 
                                           cursor-pointer"
                            >
                                Następne →
                            </button>
                        )}
                    </div>

                    {/* Finish confirmation modal */}
                    {finished && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="bg-[#12121e] border border-[#3a3a5c] rounded-2xl p-8 max-w-sm w-full mx-4 
                                            flex flex-col gap-5 shadow-2xl">
                                <div className="text-center">
                                    <div className="text-4xl mb-3">🏆</div>
                                    <h2 className="text-xl font-bold text-white">Trening zakończony!</h2>
                                    <p className="text-[#94a3b8] text-sm mt-2">
                                        Świetna robota! Czy chcesz zakończyć i wrócić do listy treningów?
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => navigate('/workouts')}
                                        className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white 
                                                   font-semibold text-sm transition-colors cursor-pointer"
                                    >
                                        ✓ Tak, zakończ trening
                                    </button>
                                    <button
                                        onClick={() => setFinished(false)}
                                        className="w-full py-3 rounded-lg border border-[#3a3a5c] text-[#94a3b8] 
                                                   hover:text-white hover:border-indigo-500 font-medium text-sm 
                                                   transition-colors cursor-pointer"
                                    >
                                        Wróć do treningu
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Add exercise */}
            <div className="border-t border-[#3a3a5c] pt-5">
                <button
                    onClick={() => setShowAddExercise((v) => !v)}
                    className="w-full py-2.5 rounded-lg border border-dashed border-[#3a3a5c] 
                               text-[#94a3b8] hover:text-white hover:border-indigo-500 text-sm 
                               font-medium transition-all cursor-pointer"
                >
                    {showAddExercise ? '✕ Anuluj' : '+ Dodaj ćwiczenie'}
                </button>
                {showAddExercise && (
                    <div className="mt-4">
                        <AddExerciseForm
                            workoutId={workout.id}
                            nextOrder={exercises.length + 1}
                            onExerciseAdded={() => {
                                onExerciseAdded();
                                setShowAddExercise(false);
                                setCurrentIndex(exercises.length); // jump to new exercise
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutActiveView;
