using System;

namespace SoundAnnoucementApp.Models;

public class QueuePatient
{
    public int Id { get; set; }
    public string? Hn { get; set; }
    public string? QueueName { get; set; }
    public int? QueueHx { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? QueueNameDep { get; set; }
    public int? QueueDep { get; set; }
    public int? Status { get; set; }
    public int? StatusHx { get; set; }
}
