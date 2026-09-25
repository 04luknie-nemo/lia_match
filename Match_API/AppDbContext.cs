using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions) { }
    public DbSet<Workplace> Workplaces => Set<Workplace>();
}