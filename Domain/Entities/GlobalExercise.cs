using Domain.Enums;

namespace Domain.Entities
{
    public class GlobalExercise
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public MuscleGroup? MuscleGroup { get; set; }
        public ExerciseType? ExerciseType { get; set; }
        public Equipment? Equipment { get; set; }
        public Difficulty? Difficulty { get; set; }
    }
}
