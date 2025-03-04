using System;

namespace SoundAnnoucementApp.Pages.MusicPad;

public interface ISoundPlayer
{
    Task Play(string sound, string pressedPadId);
}
