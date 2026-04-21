using Domain.Workouts.DTO;

namespace Domain.Stats.DTO
{
    public class DashboardDTO
    {
        public int TotalWorkouts { get; set; }
        public int TotalExercises { get; set; }
        public int TotalSets { get; set; }
        public decimal TotalVolume { get; set; }
        public WorkoutDTO? LastWorkout { get; set; }
        public List<RecentWorkoutDTO> RecentWorkouts { get; set; } = new();
    }

    public class RecentWorkoutDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int ExerciseCount { get; set; }
        public int SetCount { get; set; }
        public decimal Volume { get; set; }
    }

    public class ExerciseProgressDTO
    {
        public string ExerciseName { get; set; } = string.Empty;
        public List<ProgressEntryDTO> Entries { get; set; } = new();
    }

    public class ProgressEntryDTO
    {
        public DateTime Date { get; set; }
        public decimal MaxWeight { get; set; }
        public int MaxReps { get; set; }
        public decimal Volume { get; set; }
    }
}
