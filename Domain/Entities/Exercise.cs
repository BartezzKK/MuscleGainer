using System.Collections.Generic;

namespace Domain.Entities
{
    public class Exercise
    {
        public int Id { get; set; }
        public int WorkoutId { get; set; }
        public Workout Workout { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }
        public List<ExerciseSet> Sets { get; set; } = new();
    }
}
