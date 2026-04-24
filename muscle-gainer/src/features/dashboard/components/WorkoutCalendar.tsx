import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../../workouts/services/workoutService';
import type { WorkoutDTO } from '../../workouts/types';

const DAY_SHORT = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];
const MONTH_SHORT = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

const toDateKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const WorkoutCalendar = () => {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState<WorkoutDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        workoutService.getWorkouts()
            .then(setWorkouts)
            .finally(() => setLoading(false));
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build 11-day array: -5 … today … +5
    const days = Array.from({ length: 11 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + (i - 5));
        return d;
    });

    // Map date key → workout id (first workout that day)
    const workoutByDay = new Map<string, number>();
    workouts.forEach((w) => {
        const key = toDateKey(new Date(w.date));
        if (!workoutByDay.has(key)) workoutByDay.set(key, w.id);
    });

    const todayKey = toDateKey(today);

    return (
        <div className="border border-[#3a3a5c] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Kalendarz</h2>
                <span className="text-xs text-[#94a3b8]">
                    {today.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
                </span>
            </div>

            {loading ? (
                <div className="text-xs text-[#94a3b8] py-4 text-center">Ładowanie...</div>
            ) : (
                <div className="flex flex-col gap-1.5">
                    {days.map((day) => {
                        const key = toDateKey(day);
                        const isToday = key === todayKey;
                        const isPast = day < today;
                        const workoutId = workoutByDay.get(key);
                        const hasWorkout = workoutId !== undefined;
                        const isFuture = day > today;

                        return (
                            <button
                                key={key}
                                onClick={() => hasWorkout ? navigate(`/workouts/${workoutId}`) : undefined}
                                disabled={!hasWorkout && !isToday}
                                className={`
                                    flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all
                                    ${isToday
                                        ? 'border border-indigo-500 bg-indigo-950/30'
                                        : hasWorkout
                                            ? 'border border-green-700/60 bg-green-950/20 hover:bg-green-950/40 cursor-pointer'
                                            : 'border border-transparent'}
                                    ${!hasWorkout && !isToday ? 'cursor-default' : ''}
                                `}
                            >
                                {/* Dot indicator */}
                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                    isToday && hasWorkout ? 'bg-green-400' :
                                    isToday            ? 'bg-indigo-400 ring-2 ring-indigo-400/30' :
                                    hasWorkout         ? 'bg-green-500' :
                                    isPast             ? 'bg-[#2a2a40]' :
                                    'bg-[#2a2a40]'
                                }`} />

                                {/* Day name */}
                                <span className={`text-xs font-medium w-5 flex-shrink-0 ${
                                    isToday ? 'text-indigo-300' :
                                    hasWorkout ? 'text-green-300' :
                                    isFuture ? 'text-[#94a3b8]' :
                                    'text-[#5a5a7c]'
                                }`}>
                                    {DAY_SHORT[day.getDay()]}
                                </span>

                                {/* Date */}
                                <span className={`text-sm font-semibold flex-1 ${
                                    isToday ? 'text-white' :
                                    hasWorkout ? 'text-green-200' :
                                    isFuture ? 'text-[#94a3b8]' :
                                    'text-[#5a5a7c]'
                                }`}>
                                    {day.getDate()} {MONTH_SHORT[day.getMonth()]}
                                </span>

                                {/* Badge */}
                                {isToday && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-700/50 text-indigo-300 font-medium">
                                        Dziś
                                    </span>
                                )}
                                {hasWorkout && (
                                    <span className="text-xs text-green-400">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="border-t border-[#3a3a5c] pt-3 flex flex-col gap-1.5 text-xs text-[#94a3b8]">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                    <span>Trening wykonany</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <span>Dziś</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a40] flex-shrink-0" />
                    <span>Brak treningu</span>
                </div>
            </div>
        </div>
    );
};

export default WorkoutCalendar;
