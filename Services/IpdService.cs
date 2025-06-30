using System;
using System.Net.Http.Json;
using SoundAnnoucementApp.Dtos;

namespace SoundAnnoucementApp.Services;

public class IpdService
{
    private readonly HttpClient _http;

    public IpdService(HttpClient http) => _http = http;

    public async Task<IReadOnlyList<WardDto>> GetWardsAsync(CancellationToken ct = default)
        => await _http.GetFromJsonAsync<IReadOnlyList<WardDto>>("api/Ipd/getward", ct)
           ?? Array.Empty<WardDto>();
}
