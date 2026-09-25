public class Technology
{
    public int Id { get; set; }
    public string Name { get; set; } = "";

    public int WorkplaceId { get; set; }
    public Workplace Workplace { get; set; } = null!;
}