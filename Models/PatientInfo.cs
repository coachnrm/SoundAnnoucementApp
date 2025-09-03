using System;

namespace SoundAnnoucementApp.Models;

public class PatientInfo
{
    public string Hn { get; set; } = string.Empty;
    public string Vn { get; set; } = string.Empty;
    public string An { get; set; } = string.Empty;
    public string Pname { get; set; } = string.Empty;
    public string Fname { get; set; } = string.Empty;
    public string Lname { get; set; } = string.Empty;
    public string Birthday { get; set; } = string.Empty;
    public int Age { get; set; }
    public bool IsSelected {get; set;}
}
