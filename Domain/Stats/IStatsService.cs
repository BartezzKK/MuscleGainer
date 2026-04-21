using Domain.Stats.DTO;

namespace Domain.Stats
{
    public interface IStatsService
    {
        Task<DashboardDTO> GetDashboard(int userId);
        Task<ExerciseProgressDTO> GetExerciseProgress(int userId, string exerciseName);
    }
}
