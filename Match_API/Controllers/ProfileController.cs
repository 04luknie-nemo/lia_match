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
    [HttpPatch("{profileId}/appoint/{shownId}")]
    public async Task<IActionResult> Appoint(int profileId, string shownId, [FromBody] AppointInput input)
    {
        Workplace? workplace = await _db.Workplaces.FirstOrDefaultAsync(w => w.ShownId == shownId);
        if (workplace is null) return NotFound();

        var entry = await _db.ProfileWorkplaces.FirstOrDefaultAsync(pw => pw.StudentProfileId == profileId && pw.WorkplaceId == workplace.Id);

        if (entry is null)
        {
            entry = new ProfileWorkplace
            {
                StudentProfileId = profileId,
                WorkplaceId = workplace.Id,
                IsAppointed = input.IsAppointed,
            };
            _db.ProfileWorkplaces.Add(entry);
        }
        else
        {
            entry.IsAppointed = input.IsAppointed;
        }

        await _db.SaveChangesAsync();
        return Ok();
    }
    [HttpGet("{profileId}/appoint")]
    public async Task<IActionResult> GetProfileAppointments(int profileId) =>
        Ok(await _db.ProfileWorkplaces
            .Where(pw => pw.StudentProfileId == profileId && pw.IsAppointed)
            .Select(pw => new
            {
                pw.Id,
                pw.Workplace.ShownId,
                pw.Workplace.BussinessName,
                pw.Workplace.City,
                pw.Deadline
            })
            .OrderBy(a => a.Deadline)
            .ToListAsync());

    [HttpPatch("{profileId}/appoint/{shownId}/deadline")]
    public async Task<IActionResult> SetDeadline(int profileId, string shownId, [FromBody] DeadlineInput input)
    {
        var profileWorkplace = await _db.ProfileWorkplaces.
            FirstOrDefaultAsync(pw => pw.StudentProfileId == profileId && pw.Workplace.ShownId == shownId);

        if (profileWorkplace is null || profileWorkplace.IsAppointed == false)
        {
            return NotFound("Hittar inte en ansökan som matchar profilen och arbetsplatsen");
        }
        else
        {
            profileWorkplace.Deadline = input.Deadline;
            await _db.SaveChangesAsync();
            return Ok("Lyckades lägga till deadline!");
        }
    }
}