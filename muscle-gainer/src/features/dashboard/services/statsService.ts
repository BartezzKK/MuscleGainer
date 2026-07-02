import { api } from "../../../api/axios";
import type { DashboardDTO, ExerciseProgressDTO } from "../types";

export const statsService = {
  getDashboard: async (): Promise<DashboardDTO> => {
    const response = await api.get<DashboardDTO>("/stats/dashboard");
    return response.data;
  },

  getExerciseNames: async (): Promise<string[]> => {
    const response = await api.get<string[]>("/stats/exercises");
    return response.data;
  },

  getExerciseProgress: async (name: string): Promise<ExerciseProgressDTO> => {
    const response = await api.get<ExerciseProgressDTO>(
      `/stats/progress/${encodeURIComponent(name)}`
    );
    return response.data;
  },
};
