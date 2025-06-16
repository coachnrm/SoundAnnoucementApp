using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using SoundAnnoucementApp;
using SoundAnnoucementApp.Pages.MusicPad;
using SoundAnnoucementApp.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

//builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
// project จาก github https://github.com/Ph00n102/hosxpapi.git
// builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://localhost:5094/") });
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://172.16.200.202:8089/") });

// project จาก github https://github.com/coachnrm/OpNoteImageApi.git
builder.Services.AddHttpClient("OpNoteApi", client =>
{
    client.BaseAddress = new Uri("http://localhost:5286/");
});

builder.Services.AddHttpClient("BackEnd", client =>
{
    client.BaseAddress = new Uri("http://172.16.200.202:8089/");
    // client.BaseAddress = new Uri("http://localhost:5094/");
});

builder.Services.AddSingleton<QueueService>();
builder.Services.AddScoped<ISoundPlayer, SoundPlayer>();

await builder.Build().RunAsync();

