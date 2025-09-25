using System;
using System.Net.Http.Json;
using System.Web;

namespace SoundAnnoucementApp.Services;

public class P4PApiService
{
    private readonly IHttpClientFactory _factory;

    public P4PApiService(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    private HttpClient CreateClient() => _factory.CreateClient("P4pApi");

    public async Task<P4PSaveResponse?> SaveDocumentAsync(P4PSnapshot dto, CancellationToken ct = default)
    {
        var http = CreateClient(); // named client with BaseAddress
        using var resp = await http.PostAsJsonAsync("/api/p4p/documents", dto, ct);
        if (!resp.IsSuccessStatusCode) return null;
        return await resp.Content.ReadFromJsonAsync<P4PSaveResponse>(cancellationToken: ct);
    }

    public async Task<List<P4PDocumentSummary>> SearchDocumentsAsync(
        string? doctor, int? year, int? month, CancellationToken ct = default)
    {
        var http = CreateClient();
        var qb = HttpUtility.ParseQueryString(string.Empty);
        if (!string.IsNullOrWhiteSpace(doctor)) qb["doctor"] = doctor;
        if (year is not null) qb["year"] = year.Value.ToString("D4");
        if (month is not null) qb["month"] = month.Value.ToString("00");

        var qs = qb.ToString();
        var url = string.IsNullOrEmpty(qs) ? "/api/P4p/documents" : $"/api/P4p/documents?{qs}";

        var resp = await http.GetAsync(url, ct);
        resp.EnsureSuccessStatusCode();
        var list = await resp.Content.ReadFromJsonAsync<List<P4PDocumentSummary>>(cancellationToken: ct);
        return list ?? new();
    }

    // --- NEW: Get by id ---
    public async Task<P4PSnapshot?> GetDocumentAsync(int id, CancellationToken ct = default)
    {
        var http = CreateClient();
        var r = await http.GetAsync($"/api/P4p/documents/{id}", ct);
        if (!r.IsSuccessStatusCode) return null;
        return await r.Content.ReadFromJsonAsync<P4PSnapshot>(cancellationToken: ct);
    }

    // --- NEW: Update (PUT) ---
    public async Task<P4PSaveResponse?> UpdateDocumentAsync(int id, P4PSnapshot dto, CancellationToken ct = default)
    {
        var http = CreateClient();
        var r = await http.PutAsJsonAsync($"/api/P4p/documents/{id}", dto, ct);
        if (!r.IsSuccessStatusCode) return null;
        return await r.Content.ReadFromJsonAsync<P4PSaveResponse>(cancellationToken: ct);
    }

    // --- NEW: Delete ---
    public async Task<bool> DeleteDocumentAsync(int id, CancellationToken ct = default)
    {
        var http = CreateClient();
        var r = await http.DeleteAsync($"/api/P4p/documents/{id}", ct);
        return r.IsSuccessStatusCode;
    }
    
    public async Task<P4PSnapshot?> GetLatestByDoctorAsync(string doctor, CancellationToken ct = default)
    {
        var http = CreateClient();
        if (string.IsNullOrWhiteSpace(doctor)) return null;
        var url = $"/api/P4p/documents/latest-by-doctor?doctor={Uri.EscapeDataString(doctor)}";
        var r = await http.GetAsync(url, ct);
        if (!r.IsSuccessStatusCode) return null;
        return await r.Content.ReadFromJsonAsync<P4PSnapshot>(cancellationToken: ct);
    }

}

// --- DTOs (match backend) ---
public class P4PRowDto
{
    public string? Category { get; set; }
    public string? Activity { get; set; }
    public decimal PointsPerUnit { get; set; }
    public List<int?> Daily { get; set; } = new();
    public int TotalCount => Daily.Sum(x => x ?? 0);      // sum of days
    public decimal TotalPoints => TotalCount * PointsPerUnit;
}

public class P4PSnapshot
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string? DoctorName { get; set; }
    public string? WorkGroup { get; set; }
    public List<P4PRowDto> Rows { get; set; } = new();
}


public class P4PSaveResponse
{
    public int DocumentId { get; set; }
    public string? Message { get; set; }
}

public class P4PDocumentSummary
    {
        public int Id { get; set; }
        public string? DoctorName { get; set; }
        public string? WorkGroup { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public DateTime CreatedUtc { get; set; }
    }

