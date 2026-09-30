using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class WorkplaceController : ControllerBase
{
    private readonly AppDbContext _db;
    public WorkplaceController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
    Ok(await _db.Workplaces.Select(w => new
    {
        w.Id,
        w.ShownId,
        w.BussinessName,
        w.City,
        w.ApplicationUrl,
        w.WebsiteUrl,
        w.PreviousLIAStudents,
        technologies = w.Technologies.Select(t => new { t.Id, t.Name })
    }).ToListAsync());

    [HttpGet("{shownId}")]
    public async Task<IActionResult> GetOne(string shownId, [FromQuery] int? profileId)
    {
        var workPlace = await _db.Workplaces
            .Where(w => w.ShownId == shownId)
            .Select(w => new
            {
                w.Id,
                w.ShownId,
                w.BussinessName,
                w.City,
                w.ApplicationUrl,
                w.WebsiteUrl,
                w.PreviousLIAStudents,
                isAppointed = w.ProfileWorkplaces
                    .Any(pw => pw.StudentProfileId == profileId && pw.IsAppointed)
            }).FirstOrDefaultAsync();

        return workPlace is null ? NotFound("Workplace not found") : Ok(workPlace);
    }
}