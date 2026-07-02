using Domain.Stats.DTO;

namespace Domain.Stats
{
    public interface IStatsService
    {
        Task<DashboardDTO> GetDashboard(int userId);
        Task<ExerciseProgressDTO> GetExerciseProgress(int userId, string exerciseName);
        Task<List<string>> GetExerciseNames(int userId);
    }
}
