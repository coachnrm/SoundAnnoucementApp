using System;
using System.Data;
using System.Dynamic;

namespace SoundAnnoucementApp.Models;

public class DayEvent
{
    public int DayEventId {get; set;}
    public string Note {get; set;}
    public DateTime EventData {get; set;} = new DateTime(2024, 1, 1);
    public DateTime FromDate {get; set;} = new DateTime(2024, 1, 1);
    public DateTime ToDate {get; set;} = new DateTime(2024, 1, 1);
    public string DateValue {get; set;}
    public string DayName {get; set;}
    public string Message {get; set;}
}
