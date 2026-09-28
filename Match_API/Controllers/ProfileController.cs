using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProfileController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromBody] ProfileInput input)
    {
        var profile = new StudentProfile
        {
            City = input.City,
            ProfileTechnologies = input.Technologies
                .Select(name => new ProfileTechnology { Name = name })
                .ToList()
        };

        _db.StudentProfiles.Add(profile);
        await _db.SaveChangesAsync();

        return Ok(new { id = profile.Id });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOne(int id)
    {
        var profile = await _db.StudentProfiles
            .Include(p => p.ProfileTechnologies)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (profile is null) return NotFound();

        return Ok(new
        {
            id = profile.Id,
            city = profile.City,
            technologies = profile.ProfileTechnologies
                .Select(t => new { id = t.Id, name = t.Name })
        });
    }
}