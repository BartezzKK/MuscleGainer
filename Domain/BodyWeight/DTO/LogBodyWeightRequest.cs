using System;

namespace Domain.BodyWeight.DTO
{
    public class LogBodyWeightRequest
    {
        public decimal WeightKg { get; set; }
        public DateTime Date { get; set; }
        public int? WorkoutId { get; set; }
    }
}
