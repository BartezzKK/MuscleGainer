using Domain.Plans.DTO;

namespace Domain.Plans
{
    public interface IWeeklyLogService
    {
        Task<WeeklyLogDto> GetOrCreateCurrentWeekLog(int planId, int userId);
        Task<List<WeeklyLogDto>> GetLogHistory(int planId, int userId);
        Task<LogEntryDto?> UpdateLogEntry(int entryId, int userId, UpdateLogEntryDto dto);
    }
}
