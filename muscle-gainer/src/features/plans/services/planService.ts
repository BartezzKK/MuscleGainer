import { api } from '../../../api/axios';
import type {
    Plan, PlanDetails, PlanExercise, PlanDay, PlanDayExercise,
    WeeklyLog, LogEntry,
    CreatePlanDto, UpdatePlanDto, AddExerciseDto, UpdateExerciseDto,
    UpdateDayDto, AssignExerciseDto, UpdateLogEntryDto,
} from '../types';

export const planService = {
    // Plans
    getPlans: async (): Promise<Plan[]> => {
        const res = await api.get<Plan[]>('/plans');
        return res.data;
    },

    getPlanDetails: async (id: number): Promise<PlanDetails> => {
        const res = await api.get<PlanDetails>(`/plans/${id}`);
        return res.data;
    },

    createPlan: async (data: CreatePlanDto): Promise<Plan> => {
        const res = await api.post<Plan>('/plans', data);
        return res.data;
    },

    updatePlan: async (id: number, data: UpdatePlanDto): Promise<Plan> => {
        const res = await api.put<Plan>(`/plans/${id}`, data);
        return res.data;
    },

    deletePlan: async (id: number): Promise<void> => {
        await api.delete(`/plans/${id}`);
    },

    // Exercises
    addExercise: async (planId: number, data: AddExerciseDto): Promise<PlanExercise> => {
        const res = await api.post<PlanExercise>(`/plans/${planId}/exercises`, data);
        return res.data;
    },

    updateExercise: async (planId: number, exerciseId: number, data: UpdateExerciseDto): Promise<PlanExercise> => {
        const res = await api.put<PlanExercise>(`/plans/${planId}/exercises/${exerciseId}`, data);
        return res.data;
    },

    deleteExercise: async (planId: number, exerciseId: number): Promise<void> => {
        await api.delete(`/plans/${planId}/exercises/${exerciseId}`);
    },

    // Days
    updateDay: async (planId: number, dayId: number, data: UpdateDayDto): Promise<PlanDay> => {
        const res = await api.put<PlanDay>(`/plans/${planId}/days/${dayId}`, data);
        return res.data;
    },

    assignExerciseToDay: async (planId: number, dayId: number, data: AssignExerciseDto): Promise<PlanDayExercise> => {
        const res = await api.post<PlanDayExercise>(`/plans/${planId}/days/${dayId}/exercises`, data);
        return res.data;
    },

    removeExerciseFromDay: async (planId: number, dayId: number, planDayExerciseId: number): Promise<void> => {
        await api.delete(`/plans/${planId}/days/${dayId}/exercises/${planDayExerciseId}`);
    },

    // Weekly logs
    getCurrentWeekLog: async (planId: number): Promise<WeeklyLog> => {
        const res = await api.get<WeeklyLog>(`/plans/${planId}/logs/current`);
        return res.data;
    },

    getLogHistory: async (planId: number): Promise<WeeklyLog[]> => {
        const res = await api.get<WeeklyLog[]>(`/plans/${planId}/logs`);
        return res.data;
    },

    updateLogEntry: async (entryId: number, data: UpdateLogEntryDto): Promise<LogEntry> => {
        const res = await api.patch<LogEntry>(`/logs/entries/${entryId}`, data);
        return res.data;
    },
};
