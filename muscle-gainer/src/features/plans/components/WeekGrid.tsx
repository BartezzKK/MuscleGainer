import { useState } from 'react';
import type { PlanDay, PlanExercise } from '../types';
import DayConfigPanel from './DayConfigPanel';

const DAY_NAMES_SHORT = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];
const DAY_NAMES = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first

interface WeekGridProps {
    planId: number;
    days: PlanDay[];
    allExercises: PlanExercise[];
    onChanged: () => void;
}

const WeekGrid = ({ planId, days, allExercises, onChanged }: WeekGridProps) => {
    const [selectedDay, setSelectedDay] = useState<PlanDay | null>(null);

    const getDay = (dow: number) => days.find((d) => d.dayOfWeek === dow);

    return (
        <>
            <div>
                <h3 className="text-base font-semibold text-white mb-3">Konfiguracja tygodnia</h3>
                <div className="grid grid-cols-7 gap-2">
                    {WEEK_ORDER.map((dow) => {
                        const day = getDay(dow);
                        return (
                            <div
                                key={dow}
                                onClick={() => day && setSelectedDay(day)}
                                className={`flex flex-col rounded-xl border p-3 cursor-pointer transition-all min-h-[120px] 
                                    ${day?.isRestDay
                                        ? 'border-[#3a3a5c] bg-[#1a1a2e]/30 opacity-60'
                                        : (day?.exercises.length ?? 0) > 0
                                        ? 'border-indigo-500/60 bg-indigo-950/20'
                                        : 'border-[#3a3a5c] hover:border-[#4a4a6c]'
                                    }`}
                            >
                                <div className="text-xs font-bold text-[#94a3b8] mb-2">{DAY_NAMES_SHORT[dow]}</div>
                                {day?.isRestDay ? (
                                    <span className="text-xs text-[#94a3b8] italic">Wolny</span>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        {(day?.exercises ?? []).map((ex) => (
                                            <div key={ex.id} className="text-xs text-indigo-300 leading-tight truncate">
                                                {ex.exerciseName}
                                                <span className="text-[#94a3b8] ml-1">×{ex.sets}</span>
                                            </div>
                                        ))}
                                        {(day?.exercises.length ?? 0) === 0 && (
                                            <span className="text-xs text-[#555] italic">Kliknij aby skonfigurować</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-[#94a3b8] mt-2">Kliknij na dzień, aby przypisać ćwiczenia lub oznaczyć jako wolny.</p>
            </div>

            {selectedDay && (
                <DayConfigPanel
                    planId={planId}
                    day={selectedDay}
                    allExercises={allExercises}
                    onClose={() => setSelectedDay(null)}
                    onChanged={() => {
                        onChanged();
                        setSelectedDay(null);
                    }}
                />
            )}
        </>
    );
};

export default WeekGrid;
