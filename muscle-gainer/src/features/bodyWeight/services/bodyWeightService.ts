import { api } from '../../../api/axios';
import type { BodyWeightLogDTO, LogBodyWeightRequest } from '../types';

export const bodyWeightService = {
    logWeight: async (data: LogBodyWeightRequest): Promise<BodyWeightLogDTO> => {
        const response = await api.post<BodyWeightLogDTO>('/bodyweight', data);
        return response.data;
    },

    getHistory: async (): Promise<BodyWeightLogDTO[]> => {
        const response = await api.get<BodyWeightLogDTO[]>('/bodyweight');
        return response.data;
    },

    getLatest: async (): Promise<BodyWeightLogDTO | null> => {
        const response = await api.get<BodyWeightLogDTO | null>('/bodyweight/latest');
        return response.data;
    },
};
