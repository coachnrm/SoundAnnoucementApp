using System;
using System.Text.Json.Serialization;

namespace SoundAnnoucementApp.Dtos.MophAppoint;

public class Person
{
    [JsonPropertyName("_id")]
    public Id Id { get; set; } = new();
    
    [JsonPropertyName("cid")]
    public string Cid { get; set; } = string.Empty;
    
    [JsonPropertyName("prefix")]
    public string Prefix { get; set; } = string.Empty;
    
    [JsonPropertyName("first_name")]
    public string FirstName { get; set; } = string.Empty;
    
    [JsonPropertyName("last_name")]
    public string LastName { get; set; } = string.Empty;
    
    [JsonPropertyName("birth_date")]
    public string BirthDate { get; set; } = string.Empty;
    
    [JsonPropertyName("phone_number")]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [JsonPropertyName("province_code")]
    public string? ProvinceCode { get; set; }
    
    [JsonPropertyName("district_code")]
    public string? DistrictCode { get; set; }
    
    [JsonPropertyName("tambol_code")]
    public string? TambolCode { get; set; }
    
    [JsonPropertyName("moo_code")]
    public string? MooCode { get; set; }
}
