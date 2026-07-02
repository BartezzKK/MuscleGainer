import { useEffect, useState } from 'react';
import { statsService } from '../services/statsService';
import type { DashboardDTO } from '../types';
import StatsOverview from '../components/StatsOverview';
import RecentWorkouts from '../components/RecentWorkouts';
import ProgressChart from '../components/ProgressChart';
import WeeklyPlanWidget from '../components/WeeklyPlanWidget';
import WorkoutCalendar from '../components/WorkoutCalendar';
import BodyWeightChart from '../components/BodyWeightChart';

const DashboardPage = () => {
    const [dashboard, setDashboard] = useState<DashboardDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [exerciseNames, setExerciseNames] = useState<string[]>([]);

    useEffect(() => {
        statsService.getDashboard()
            .then(setDashboard)
            .catch(() => setError('Błąd podczas pobierania danych.'))
            .finally(() => setLoading(false));

        statsService.getExerciseNames()
            .then(setExerciseNames)
            .catch(() => {});
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-[#94a3b8]">
                Ładowanie dashboardu...
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="px-4 py-3 rounded-lg bg-[#3b1414] text-[#f87171] text-sm max-w-md">
                {error || 'Brak danych.'}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Nagłówek */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-[#94a3b8] text-sm mt-1">Podsumowanie Twoich treningów i postępów</p>
            </div>

            {/* Karty statystyk */}
            <StatsOverview stats={dashboard} />

            <BodyWeightChart />

            {/* Główny layout: kalendarz (lewo) + treść (prawo) */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* Kalendarz — lewa kolumna */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <WorkoutCalendar />
                </div>

                {/* Prawa kolumna */}
                <div className="flex-1 flex flex-col gap-6 min-w-0">

                    {/* Plan tygodnia */}
                    <WeeklyPlanWidget />

                    {/* Ostatnie treningi */}
                    <RecentWorkouts workouts={dashboard.recentWorkouts} />

                    {/* Progres ćwiczenia */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5 max-w-xs">
                            <label className="text-sm font-semibold text-[#94a3b8]">
                                Sprawdź progres ćwiczenia
                            </label>
                            <select
                                value={selectedExercise}
                                onChange={(e) => setSelectedExercise(e.target.value)}
                                className="px-4 py-2.5 rounded-lg bg-[#252540] border border-[#3a3a5c] text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm cursor-pointer"
                            >
                                <option value="">-- Wybierz ćwiczenie --</option>
                                {exerciseNames.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedExercise && <ProgressChart exerciseName={selectedExercise} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
