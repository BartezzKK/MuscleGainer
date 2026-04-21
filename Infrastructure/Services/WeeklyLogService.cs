using Domain.Entities;
using Domain.Plans;
using Domain.Plans.DTO;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class WeeklyLogService : IWeeklyLogService
    {
        private readonly AppDbContext _context;

        public WeeklyLogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<WeeklyLogDto> GetOrCreateCurrentWeekLog(int planId, int userId)
        {
            var plan = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId);

            if (plan is null) throw new Exception("Plan not found.");

            var weekStart = GetCurrentWeekMonday();

            var log = await _context.WeeklyLogs
                .Include(l => l.Entries)
                    .ThenInclude(e => e.PlanDayExercise)
                        .ThenInclude(de => de.PlanExercise)
                .Include(l => l.Entries)
                    .ThenInclude(e => e.PlanDayExercise)
                        .ThenInclude(de => de.PlanDay)
                .FirstOrDefaultAsync(l => l.TrainingPlanId == planId && l.WeekStartDate == weekStart);

            if (log is null)
            {
                log = await CreateWeeklyLog(planId, weekStart);
            }

            return MapWeeklyLog(log);
        }

        public async Task<List<WeeklyLogDto>> GetLogHistory(int planId, int userId)
        {
            var plan = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId);

            if (plan is null) throw new Exception("Plan not found.");

            var logs = await _context.WeeklyLogs
                .Where(l => l.TrainingPlanId == planId)
                .Include(l => l.Entries)
                    .ThenInclude(e => e.PlanDayExercise)
                        .ThenInclude(de => de.PlanExercise)
                .Include(l => l.Entries)
                    .ThenInclude(e => e.PlanDayExercise)
                        .ThenInclude(de => de.PlanDay)
                .OrderByDescending(l => l.WeekStartDate)
                .ToListAsync();

            return logs.Select(MapWeeklyLog).ToList();
        }

        public async Task<LogEntryDto?> UpdateLogEntry(int entryId, int userId, UpdateLogEntryDto dto)
        {
            var entry = await _context.LogEntries
                .Include(e => e.WeeklyLog)
                    .ThenInclude(l => l.TrainingPlan)
                .Include(e => e.PlanDayExercise)
                    .ThenInclude(de => de.PlanExercise)
                .Include(e => e.PlanDayExercise)
                    .ThenInclude(de => de.PlanDay)
                .FirstOrDefaultAsync(e => e.Id == entryId && e.WeeklyLog.TrainingPlan.UserId == userId);

            if (entry is null) return null;

            entry.IsCompleted = dto.IsCompleted;
            entry.Reps = dto.Reps;
            entry.WeightKg = dto.WeightKg;
            entry.CompletedAt = dto.IsCompleted ? DateTime.UtcNow : null;

            await _context.SaveChangesAsync();

            return MapLogEntry(entry);
        }


        private async Task<WeeklyLog> CreateWeeklyLog(int planId, DateTime weekStart)
        {
            var log = new WeeklyLog
            {
                TrainingPlanId = planId,
                WeekStartDate = weekStart
            };

            _context.WeeklyLogs.Add(log);
            await _context.SaveChangesAsync();

            var days = await _context.PlanDays
                .Where(d => d.TrainingPlanId == planId && !d.IsRestDay)
                .Include(d => d.Exercises)
                .ToListAsync();

            var entries = new List<LogEntry>();
            foreach (var day in days)
            {
                foreach (var pde in day.Exercises)
                {
                    for (int i = 1; i <= pde.Sets; i++)
                    {
                        entries.Add(new LogEntry
                        {
                            WeeklyLogId = log.Id,
                            PlanDayExerciseId = pde.Id,
                            SetNumber = i,
                            IsCompleted = false
                        });
                    }
                }
            }

            _context.LogEntries.AddRange(entries);
            await _context.SaveChangesAsync();

            return await _context.WeeklyLogs
                .Include(l => l.Entries)
                    .ThenInclude(e => e.PlanDayExercise)
                        .ThenInclude(de => de.PlanExercise)
                .Include(l => l.Entries)
                    .ThenInclude(e => e.PlanDayExercise)
                        .ThenInclude(de => de.PlanDay)
                .FirstAsync(l => l.Id == log.Id);
        }

        private static DateTime GetCurrentWeekMonday()
        {
            var today = DateTime.UtcNow.Date;
            var diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
            return today.AddDays(-diff);
        }

        private static WeeklyLogDto MapWeeklyLog(WeeklyLog log)
        {
            var grouped = log.Entries
                .GroupBy(e => e.PlanDayExercise.PlanDay)
                .Select(g => new WeeklyLogDayDto
                {
                    DayOfWeek = (int)g.Key.DayOfWeek,
                    PlanDayId = g.Key.Id,
                    Entries = g.OrderBy(e => e.PlanDayExercise.PlanExercise.Name)
                                .ThenBy(e => e.SetNumber)
                                .Select(MapLogEntry)
                                .ToList()
                })
                .OrderBy(d => d.DayOfWeek)
                .ToList();

            return new WeeklyLogDto
            {
                Id = log.Id,
                WeekStartDate = log.WeekStartDate,
                Days = grouped
            };
        }

        private static LogEntryDto MapLogEntry(LogEntry e) => new()
        {
            Id = e.Id,
            SetNumber = e.SetNumber,
            ExerciseName = e.PlanDayExercise.PlanExercise.Name,
            Reps = e.Reps,
            WeightKg = e.WeightKg,
            IsCompleted = e.IsCompleted,
            CompletedAt = e.CompletedAt
        };
    }
}
