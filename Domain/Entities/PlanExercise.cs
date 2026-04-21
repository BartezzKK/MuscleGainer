using Domain.Enums;

namespace Domain.Entities
{
    public class PlanExercise
    {
        public int Id { get; set; }
        public int TrainingPlanId { get; set; }
        public TrainingPlan TrainingPlan { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public int DefaultSets { get; set; } = 3;
        public MuscleGroup? MuscleGroup { get; set; }
        public ExerciseType? ExerciseType { get; set; }
        public Equipment? Equipment { get; set; }
        public Difficulty? Difficulty { get; set; }

        public List<PlanDayExercise> PlanDayExercises { get; set; } = new();
    }
}
