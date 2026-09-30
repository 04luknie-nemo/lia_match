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

    // [HttpGet("{id}")]
    // public async Task<IActionResult> GetOne(int id)
    // {
    //     Workplace? workPlace = await _db.Workplaces.FindAsync(id);
    //     return workPlace is null ? NotFound("Workplace not found") : Ok(workPlace);
    // }
    [HttpGet("{shownId}")]
    public async Task<IActionResult> GetOne(string shownId)
    {
        Workplace? workPlace = await _db.Workplaces.FirstOrDefaultAsync(w => w.ShownId == shownId);
        return workPlace is null ? NotFound("Workplace not found") : Ok(workPlace);
    }
}