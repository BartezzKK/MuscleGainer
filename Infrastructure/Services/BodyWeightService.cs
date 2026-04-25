using Domain.BodyWeight;
using Domain.BodyWeight.DTO;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class BodyWeightService : IBodyWeightService
    {
        private readonly AppDbContext _context;

        public BodyWeightService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<BodyWeightLogDTO> LogWeight(int userId, LogBodyWeightRequest request)
        {
            var log = new BodyWeightLog
            {
                UserId = userId,
                WeightKg = request.WeightKg,
                Date = request.Date,
                WorkoutId = request.WorkoutId
            };

            _context.BodyWeightLogs.Add(log);
            await _context.SaveChangesAsync();

            return MapToDTO(log);
        }

        public async Task<List<BodyWeightLogDTO>> GetHistory(int userId)
        {
            var logs = await _context.BodyWeightLogs
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.Date)
                .ToListAsync();

            return logs.Select(MapToDTO).ToList();
        }

        public async Task<BodyWeightLogDTO?> GetLatest(int userId)
        {
            var log = await _context.BodyWeightLogs
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.Date)
                .FirstOrDefaultAsync();

            return log is null ? null : MapToDTO(log);
        }

        private static BodyWeightLogDTO MapToDTO(BodyWeightLog log) => new()
        {
            Id = log.Id,
            WeightKg = log.WeightKg,
            Date = log.Date,
            WorkoutId = log.WorkoutId
        };
    }
}
