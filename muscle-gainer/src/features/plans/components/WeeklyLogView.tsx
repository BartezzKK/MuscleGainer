import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WeeklyLog, LogEntry } from '../types';
import { planService } from '../services/planService';
import { workoutService } from '../../workouts/services/workoutService';
import ProgressBadge from './ProgressBadge';

const DAY_NAMES = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

interface WeeklyLogViewProps {
    log: WeeklyLog;
    onChanged: () => void;
}

interface EntryRowProps {
    entry: LogEntry;
    onSave: (id: number, reps: number | null, weightKg: number | null, completed: boolean) => Promise<void>;
}

const EntryRow = ({ entry, onSave }: EntryRowProps) => {
    const [reps, setReps] = useState<string>(entry.reps?.toString() ?? '');
    const [weight, setWeight] = useState<string>(entry.weightKg?.toString() ?? '');
    const [saving, setSaving] = useState(false);

    const handleComplete = async () => {
        setSaving(true);
        try {
            await onSave(
                entry.id,
                reps !== '' ? Number(reps) : null,
                weight !== '' ? Number(weight) : null,
                !entry.isCompleted,
            );
        } finally {
            setSaving(false);
        }
    };

    const handleBlurSave = async () => {
        if (!entry.isCompleted) return;
        setSaving(true);
        try {
            await onSave(
                entry.id,
                reps !== '' ? Number(reps) : null,
                weight !== '' ? Number(weight) : null,
                true,
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={`flex items-center gap-3 rounded-lg px-3 py-2 border transition-all text-sm
            ${entry.isCompleted ? 'border-green-700/50 bg-green-950/20' : 'border-[#3a3a5c]'}`}>
            <button
                onClick={handleComplete}
                disabled={saving}
                className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer
                    ${entry.isCompleted ? 'bg-green-600 border-green-600 text-white' : 'border-[#3a3a5c] hover:border-indigo-500'}`}
            >
                {entry.isCompleted && <span className="text-xs">✓</span>}
            </button>

            <span className={`flex-1 ${entry.isCompleted ? 'text-green-300' : 'text-white'}`}>
                {entry.exerciseName} — seria {entry.setNumber}
            </span>

            <input
                type="number"
                min={0}
                placeholder="powt."
                className="w-16 bg-[#0f0f1a] border border-[#3a3a5c] rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-indigo-500"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                onBlur={handleBlurSave}
            />
            <span className="text-xs text-[#94a3b8]">powt.</span>

            <input
                type="number"
                min={0}
                step={0.5}
                placeholder="kg"
                className="w-16 bg-[#0f0f1a] border border-[#3a3a5c] rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-indigo-500"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onBlur={handleBlurSave}
            />
            <span className="text-xs text-[#94a3b8]">kg</span>
        </div>
    );
};

const WeeklyLogView = ({ log, onChanged }: WeeklyLogViewProps) => {
    const navigate = useNavigate();
    const [startingDay, setStartingDay] = useState<number | null>(null);
    const todayDow = new Date().getDay();

    const handleStartWorkout = async (planDayId: number, date?: string) => {
        setStartingDay(planDayId);
        try {
            const workout = await workoutService.createFromPlanDay(planDayId, date);
            navigate(`/workouts/${workout.id}`);
        } catch {
            setStartingDay(null);
        }
    };

    const handleSave = async (id: number, reps: number | null, weightKg: number | null, completed: boolean) => {
        await planService.updateLogEntry(id, { isCompleted: completed, reps, weightKg });
        onChanged();
    };

    const allEntries = log.days.flatMap((d) => d.entries);
    const total = allEntries.length;
    const completed = allEntries.filter((e) => e.isCompleted).length;

    const weekEnd = new Date(log.weekStartDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });

    return (
        <div className="flex flex-col gap-6">
            <div className="border border-[#3a3a5c] rounded-xl p-4">
                <p className="text-sm text-[#94a3b8] mb-3">
                    Tydzień: <span className="text-white">{fmt(new Date(log.weekStartDate))} – {fmt(weekEnd)}</span>
                </p>
                <ProgressBadge completed={completed} total={total} />
            </div>

            {WEEK_ORDER.map((dow) => {
                const day = log.days.find((d) => d.dayOfWeek === dow);
                if (!day || day.entries.length === 0) return null;

                const dayCompleted = day.entries.filter((e) => e.isCompleted).length;

                return (
                    <div key={dow} className="border border-[#3a3a5c] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-white">{DAY_NAMES[dow]}</h4>
                                {dow === todayDow && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-700/40 text-indigo-300 font-medium">
                                        Dziś
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-[#94a3b8]">{dayCompleted}/{day.entries.length} serii</span>
                                {dow <= todayDow && (
                                    <button
                                        onClick={() => {
                                            const weekStart = new Date(log.weekStartDate);
                                            const dayDate = new Date(weekStart);
                                            const weekStartDow = weekStart.getDay();
                                            const diff = dow >= weekStartDow ? dow - weekStartDow : 7 - weekStartDow + dow;
                                            dayDate.setDate(weekStart.getDate() + diff);
                                            const dateStr = dow === todayDow ? undefined : dayDate.toISOString();
                                            handleStartWorkout(day.planDayId, dateStr);
                                        }}
                                        disabled={startingDay === day.planDayId}
                                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer 
                                                   disabled:opacity-50 disabled:cursor-not-allowed
                                                   ${dow === todayDow 
                                                       ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                                                       : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
                                    >
                                        {startingDay === day.planDayId 
                                            ? 'Tworzenie...' 
                                            : dow === todayDow 
                                                ? '▶ Rozpocznij trening' 
                                                : '▶ Nadrób trening'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {day.entries.map((entry) => (
                                <EntryRow key={entry.id} entry={entry} onSave={handleSave} />
                            ))}
                        </div>
                    </div>
                );
            })}

            {total === 0 && (
                <p className="text-[#94a3b8] text-sm text-center py-8">
                    Brak zaplanowanych ćwiczeń na ten tydzień. Skonfiguruj plan najpierw.
                </p>
            )}
        </div>
    );
};

export default WeeklyLogView;
