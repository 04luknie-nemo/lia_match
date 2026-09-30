using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions) { }
    public DbSet<Workplace> Workplaces => Set<Workplace>();
    public DbSet<Technology> Technologies => Set<Technology>();
    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();
    public DbSet<ProfileTechnology> ProfileTechnologies => Set<ProfileTechnology>();
}