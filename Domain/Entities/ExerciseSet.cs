namespace Domain.Entities
{
    public class ExerciseSet
    {
        public int Id { get; set; }
        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;
        public int Reps { get; set; }
        public decimal Weight { get; set; }
        public int Order { get; set; }
    }
}
