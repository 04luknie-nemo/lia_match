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
        Ok(await _db.Workplaces.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOne(int id)
    {
        Workplace? workPlace = await _db.Workplaces.FindAsync(id);
        return workPlace is null ? NotFound("Workplace not found") : Ok(workPlace);
    }
}
// eheehehedsdsdsdsd