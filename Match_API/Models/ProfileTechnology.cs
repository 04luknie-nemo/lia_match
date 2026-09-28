using System.Text.Json.Serialization;

public class ProfileTechnology
{
    public int Id { get; set; }
    public string Name { get; set; } = "";

    public int StudentProfileId { get; set; }
    [JsonIgnore]
    public StudentProfile StudentProfile { get; set; } = null!;
}