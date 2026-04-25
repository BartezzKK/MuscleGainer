using System;

namespace Domain.BodyWeight.DTO
{
    public class BodyWeightLogDTO
    {
        public int Id { get; set; }
        public decimal WeightKg { get; set; }
        public DateTime Date { get; set; }
        public int? WorkoutId { get; set; }
    }
}
