// ─── Enums (must match backend) ──────────────────────────────────────────────

export enum MuscleGroup {
    Klatka = 0,
    Plecy = 1,
    Barki = 2,
    Biceps = 3,
    Triceps = 4,
    BrzuchCore = 5,
    Uda = 6,
    DwugloweUda = 7,
    Posladki = 8,
    Lydki = 9,
    DolnePlecy = 10,
    Przedramiona = 11,
    CaleCialo = 12,
}

export enum ExerciseType {
    Silowe = 0,
    Cardio = 1,
    Funkcjonalne = 2,
    Mobility = 3,
    Kalistenika = 4,
}

export enum Equipment {
    Brak = 0,
    Sztanga = 1,
    Hantle = 2,
    Maszyna = 3,
    Kettlebell = 4,
    GuMyOporowe = 5,
    DrazekPorece = 6,
}

export enum Difficulty {
    Poczatkujacy = 0,
    Srednio = 1,
    Zaawansowany = 2,
}

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
    [MuscleGroup.Klatka]: 'Klatka piersiowa',
    [MuscleGroup.Plecy]: 'Plecy',
    [MuscleGroup.Barki]: 'Barki',
    [MuscleGroup.Biceps]: 'Biceps',
    [MuscleGroup.Triceps]: 'Triceps',
    [MuscleGroup.BrzuchCore]: 'Brzuch / Core',
    [MuscleGroup.Uda]: 'Uda',
    [MuscleGroup.DwugloweUda]: 'Dwugłowe uda',
    [MuscleGroup.Posladki]: 'Pośladki',
    [MuscleGroup.Lydki]: 'Łydki',
    [MuscleGroup.DolnePlecy]: 'Dolne plecy',
    [MuscleGroup.Przedramiona]: 'Przedramiona',
    [MuscleGroup.CaleCialo]: 'Całe ciało',
};

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
    [ExerciseType.Silowe]: 'Siłowe',
    [ExerciseType.Cardio]: 'Cardio',
    [ExerciseType.Funkcjonalne]: 'Funkcjonalne',
    [ExerciseType.Mobility]: 'Mobility',
    [ExerciseType.Kalistenika]: 'Kalistenika',
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
    [Equipment.Brak]: 'Brak',
    [Equipment.Sztanga]: 'Sztanga',
    [Equipment.Hantle]: 'Hantle',
    [Equipment.Maszyna]: 'Maszyna',
    [Equipment.Kettlebell]: 'Kettlebell',
    [Equipment.GuMyOporowe]: 'Gumy oporowe',
    [Equipment.DrazekPorece]: 'Drążek / Poręcze',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
    [Difficulty.Poczatkujacy]: 'Początkujący',
    [Difficulty.Srednio]: 'Średniozaawansowany',
    [Difficulty.Zaawansowany]: 'Zaawansowany',
};

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface Plan {
    id: number;
    name: string;
    isActive: boolean;
    createdAt: string;
}

export interface PlanExercise {
    id: number;
    name: string;
    defaultSets: number;
    muscleGroup: MuscleGroup | null;
    exerciseType: ExerciseType | null;
    equipment: Equipment | null;
    difficulty: Difficulty | null;
}

export interface PlanDayExercise {
    id: number;
    planExerciseId: number;
    exerciseName: string;
    sets: number;
}

export interface PlanDay {
    id: number;
    dayOfWeek: number; // 0 = Sunday … 6 = Saturday
    isRestDay: boolean;
    exercises: PlanDayExercise[];
}

export interface PlanDetails extends Plan {
    exercises: PlanExercise[];
    days: PlanDay[];
}

export interface LogEntry {
    id: number;
    setNumber: number;
    exerciseName: string;
    reps: number | null;
    weightKg: number | null;
    isCompleted: boolean;
    completedAt: string | null;
}

export interface WeeklyLogDay {
    dayOfWeek: number;
    planDayId: number;
    entries: LogEntry[];
}

export interface WeeklyLog {
    id: number;
    weekStartDate: string;
    days: WeeklyLogDay[];
}

// Request DTOs
export interface CreatePlanDto {
    name: string;
}

export interface UpdatePlanDto {
    name: string;
    isActive: boolean;
}

export interface AddExerciseDto {
    name: string;
    defaultSets: number;
    muscleGroup: MuscleGroup | null;
    exerciseType: ExerciseType | null;
    equipment: Equipment | null;
    difficulty: Difficulty | null;
}

export interface UpdateExerciseDto {
    name: string;
    defaultSets: number;
    muscleGroup: MuscleGroup | null;
    exerciseType: ExerciseType | null;
    equipment: Equipment | null;
    difficulty: Difficulty | null;
}

export interface UpdateDayDto {
    isRestDay: boolean;
}

export interface AssignExerciseDto {
    planExerciseId: number;
    sets: number;
}

export interface UpdateLogEntryDto {
    isCompleted: boolean;
    reps: number | null;
    weightKg: number | null;
}
