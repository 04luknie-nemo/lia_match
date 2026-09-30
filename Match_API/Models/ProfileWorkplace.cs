using System.Text.Json.Serialization;

public class ProfileWorkplace
{
    public int Id { get; set; }
    public bool IsAppointed { get; set; }

    public int StudentProfileId { get; set; }
    [JsonIgnore]
    public StudentProfile StudentProfile { get; set; } = null!;

    public int WorkplaceId { get; set; }
    [JsonIgnore]
    public Workplace Workplace { get; set; } = null!;
}