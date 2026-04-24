import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { planService } from '../../plans/services/planService';
import { workoutService } from '../../workouts/services/workoutService';
import type { WeeklyLog, Plan } from '../../plans/types';

const DAY_NAMES = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

const WeeklyPlanWidget = () => {
    const navigate = useNavigate();
    const [activePlan, setActivePlan] = useState<Plan | null>(null);
    const [log, setLog] = useState<WeeklyLog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [starting, setStarting] = useState(false);

    const todayDow = new Date().getDay(); // 0 = Sunday

    const handleStartToday = async (planDayId: number) => {
        setStarting(true);
        try {
            const workout = await workoutService.createFromPlanDay(planDayId);
            navigate(`/workouts/${workout.id}`);
        } catch {
            setStarting(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const plans = await planService.getPlans();
                const active = plans.find((p) => p.isActive) ?? null;
                setActivePlan(active);
                if (active) {
                    const weekLog = await planService.getCurrentWeekLog(active.id);
                    setLog(weekLog);
                }
            } catch {
                setError('Nie udało się załadować planu.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="border border-[#3a3a5c] rounded-xl p-5 text-[#94a3b8] text-sm">
                Ładowanie planu tygodnia...
            </div>
        );
    }

    if (error) {
        return (
            <div className="border border-red-800 rounded-xl p-5 text-red-400 text-sm">{error}</div>
        );
    }

    if (!activePlan || !log) {
        return (
            <div className="border border-[#3a3a5c] rounded-xl p-5">
                <h2 className="text-lg font-bold text-white mb-2">Plan tygodnia</h2>
                <p className="text-[#94a3b8] text-sm">
                    Brak aktywnego planu.{' '}
                    <Link to="/plans" className="text-indigo-400 hover:text-indigo-300 underline">
                        Utwórz plan
                    </Link>
                </p>
            </div>
        );
    }

    const weekEnd = new Date(log.weekStartDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const fmt = (d: Date) =>
        d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });

    const allEntries = log.days.flatMap((d) => d.entries);
    const completedCount = allEntries.filter((e) => e.isCompleted).length;
    const totalCount = allEntries.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Today's exercises
    const todayDay = log.days.find((d) => d.dayOfWeek === todayDow);
    const todayEntries = todayDay?.entries ?? [];
    const todayExercises = Array.from(
        todayEntries
            .reduce((map, e) => {
                if (!map.has(e.exerciseName)) map.set(e.exerciseName, []);
                map.get(e.exerciseName)!.push(e);
                return map;
            }, new Map<string, typeof todayEntries>())
            .entries()
    );
    const todayCompleted = todayEntries.filter((e) => e.isCompleted).length;

    return (
        <div className="border border-[#3a3a5c] rounded-xl p-5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-white">Plan tygodnia</h2>
                    <p className="text-xs text-[#94a3b8] mt-0.5">
                        {activePlan.name} · {fmt(new Date(log.weekStartDate))} – {fmt(weekEnd)}
                    </p>
                </div>
                <Link
                    to={`/plans/${activePlan.id}/week`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-700 
                               rounded-lg px-3 py-1.5 hover:border-indigo-500 transition-colors"
                >
                    Otwórz log →
                </Link>
            </div>

            {/* Progress bar */}
            <div>
                <div className="flex justify-between text-xs text-[#94a3b8] mb-1.5">
                    <span>Postęp tygodnia</span>
                    <span>{completedCount}/{totalCount} serii ({progress}%)</span>
                </div>
                <div className="w-full bg-[#1e1e30] rounded-full h-2">
                    <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Today */}
            <div className="border-t border-[#3a3a5c] pt-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">
                        Dzisiaj — {DAY_NAMES[todayDow]}
                    </span>
                    {todayEntries.length > 0 && (
                        <span className="text-xs text-[#94a3b8]">
                            {todayCompleted}/{todayEntries.length} serii
                        </span>
                    )}
                </div>

                {todayExercises.length === 0 ? (
                    <p className="text-[#94a3b8] text-sm">Brak ćwiczeń na dziś. Czas odpocząć! 💪</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {/* Quick-start button */}
                        {todayDay && (
                            <button
                                onClick={() => handleStartToday(todayDay.planDayId)}
                                disabled={starting}
                                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 
                                           text-white font-bold text-sm transition-colors cursor-pointer 
                                           disabled:opacity-60 disabled:cursor-not-allowed flex items-center 
                                           justify-center gap-2"
                            >
                                {starting ? (
                                    <>⏳ Tworzenie treningu...</>
                                ) : (
                                    <>▶ Rozpocznij trening dziś</>
                                )}
                            </button>
                        )}

                        {/* Exercise list */}
                        <div className="flex flex-col gap-2">
                        {todayExercises.map(([name, entries]) => {
                            const done = entries.filter((e) => e.isCompleted).length;
                            const all = entries.length;
                            const allDone = done === all;
                            return (
                                <div
                                    key={name}
                                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 border text-sm transition-all
                                        ${allDone
                                            ? 'border-green-700/50 bg-green-950/20'
                                            : 'border-[#3a3a5c] bg-[#1a1a2e]'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        {allDone && (
                                            <span className="text-green-500 text-xs">✓</span>
                                        )}
                                        <span className={allDone ? 'text-green-300' : 'text-white'}>
                                            {name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-[#94a3b8]">{done}/{all} serii</span>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeeklyPlanWidget;
