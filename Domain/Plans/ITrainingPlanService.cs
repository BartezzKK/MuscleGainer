using Domain.Plans.DTO;

namespace Domain.Plans
{
    public interface ITrainingPlanService
    {
        Task<List<PlanDto>> GetUserPlans(int userId);
        Task<PlanDetailsDto?> GetPlanDetails(int planId, int userId);
        Task<PlanDto> CreatePlan(int userId, CreatePlanDto dto);
        Task<PlanDto?> UpdatePlan(int planId, int userId, UpdatePlanDto dto);
        Task<bool> DeletePlan(int planId, int userId);

        Task<PlanExerciseDto> AddExercise(int planId, int userId, AddExerciseDto dto);
        Task<PlanExerciseDto?> UpdateExercise(int planId, int exerciseId, int userId, UpdateExerciseDto dto);
        Task<bool> DeleteExercise(int planId, int exerciseId, int userId);

        Task<PlanDayDto?> UpdateDay(int planId, int dayId, int userId, UpdateDayDto dto);
        Task<PlanDayExerciseDto?> AssignExerciseToDay(int planId, int dayId, int userId, AssignExerciseDto dto);
        Task<bool> RemoveExerciseFromDay(int planId, int dayId, int planDayExerciseId, int userId);
    }
}
