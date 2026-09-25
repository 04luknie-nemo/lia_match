public class Workplace
{
    public int Id { get; set; }
    public string ShownId { get; set; } = "";
    public string BussinessName { get; set; } = "";
    public string City { get; set; } = "";
    public string? ApplicationUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public int PreviousLIAStudents { get; set; } = 0;
    public List<Technology> Technologies { get; set; } = new();

    public Workplace() { }

    public Workplace(string bussinessName, string city, string? applicationUrl, string? websiteUrl, int previousLIAStudents)
    {
        ShownId = "WORK" + Random.Shared.Next(10000, 80000);

        if (string.IsNullOrWhiteSpace(bussinessName))
        {
            throw new ArgumentException("Bussinesname may not be empty", nameof(bussinessName));
        }
        if (string.IsNullOrWhiteSpace(city))
        {
            throw new ArgumentException("City may not be empty", nameof(city));
        }
        BussinessName = bussinessName;
        City = city;
        ApplicationUrl = applicationUrl;
        WebsiteUrl = websiteUrl;
        PreviousLIAStudents = previousLIAStudents;
    }
}