using Domain.Workouts.DTO;

namespace Domain.Workouts
{
    public interface IWorkoutService
    {
        Task<List<WorkoutDTO>> GetUserWorkouts(int userId);
        Task<WorkoutDTO?> GetWorkoutById(int id, int userId);
        Task<WorkoutDTO> CreateWorkout(int userId, CreateWorkoutRequest request);
        Task<WorkoutDTO> AddExercise(int workoutId, int userId, AddExerciseRequest request);
        Task<ExerciseDTO> AddSet(int exerciseId, int userId, AddSetRequest request);
        Task DeleteWorkout(int id, int userId);
    }
}
