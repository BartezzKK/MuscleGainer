namespace Domain.Workouts.DTO
{
    public class AddSetRequest
    {
        public int Reps { get; set; }
        public decimal Weight { get; set; }
        public int Order { get; set; }
    }
}
