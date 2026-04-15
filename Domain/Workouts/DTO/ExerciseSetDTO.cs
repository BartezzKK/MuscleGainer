namespace Domain.Workouts.DTO
{
    public class ExerciseSetDTO
    {
        public int Id { get; set; }
        public int Reps { get; set; }
        public decimal Weight { get; set; }
        public int Order { get; set; }
    }
}
