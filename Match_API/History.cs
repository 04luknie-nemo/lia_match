public static class HistoryData
{
    public static Dictionary<string, int> LoadTotals(string path)
    {
        var totals = new Dictionary<string, int>();
        var lines = File.ReadAllLines(path);

        foreach (var line in lines.Skip(2))
        {
            var cols = line.Split(",");
            if (cols.Length < 3)
                continue;

            var name = cols[0].Trim();
            if (string.IsNullOrWhiteSpace(name))
                continue;

            int sum = 0;
            for (int i = 2; i < cols.Length; i++)
            {
                if (int.TryParse(cols[i].Trim(), out var value))
                {
                    sum += value;
                }
            }
            totals[name] = sum;
        }
        return totals;
    }
}