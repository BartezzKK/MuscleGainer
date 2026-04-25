using System;

namespace Domain.Entities
{
    public class BodyWeightLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public decimal WeightKg { get; set; }
        public DateTime Date { get; set; }
        public int? WorkoutId { get; set; }
        public Workout? Workout { get; set; }
    }
}
