public static class SeedData
{
    public static void Seed(AppDbContext db)
    {
        if (db.Workplaces.Any()) return;

        var historyTotals = HistoryData.LoadTotals("Data/History.csv");
        var lines = File.ReadAllLines("Data/Workplaces.csv");

        foreach (var line in lines.Skip(1))
        {
            if (string.IsNullOrWhiteSpace(line)) continue;

            string[] cols = line.Split(",");
            if (cols.Length < 9) continue;

            string name = cols[0].Trim();
            string city = cols[1].Trim();
            string? applicationUrl = string.IsNullOrWhiteSpace(cols[3]) ? null : cols[3].Trim();
            string? websiteUrl = string.IsNullOrWhiteSpace(cols[8]) ? null : cols[8].Trim();

            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(city))
                continue;

            int previousCount = historyTotals.TryGetValue(name, out var total) ? total : 0;

            db.Workplaces.Add(new Workplace(name, city, applicationUrl, websiteUrl, previousCount));
        }
        db.SaveChanges();
    }
}