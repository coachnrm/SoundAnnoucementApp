using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using SoundAnnoucementApp;
using SoundAnnoucementApp.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

//builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
// project จาก github https://github.com/Ph00n102/hosxpapi.git
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://localhost:5094/") });

// project จาก github https://github.com/coachnrm/OpNoteImageApi.git
builder.Services.AddHttpClient("OpNoteApi", client =>
{
    client.BaseAddress = new Uri("http://localhost:5286/");
});

builder.Services.AddSingleton<QueueService>();

await builder.Build().RunAsync();
