using Domain.BodyWeight.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.BodyWeight
{
    public interface IBodyWeightService
    {
        Task<BodyWeightLogDTO> LogWeight(int userId, LogBodyWeightRequest request);
        Task<List<BodyWeightLogDTO>> GetHistory(int userId);
        Task<BodyWeightLogDTO?> GetLatest(int userId);
    }
}
