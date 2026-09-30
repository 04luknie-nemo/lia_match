public class StudentProfile
{
    public int Id { get; set; }
    public string City { get; set; } = "";
    public List<ProfileTechnology> ProfileTechnologies { get; set; } = new();
    public List<ProfileWorkplace> ProfileWorkplaces { get; set; } = new();
}