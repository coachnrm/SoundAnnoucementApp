FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build-env
WORKDIR /SoundAnnoucementApp
COPY SoundAnnoucementApp.csproj .
RUN dotnet restore "SoundAnnoucementApp.csproj"
COPY / .
RUN dotnet build "SoundAnnoucementApp.csproj" -c Release -o /build
FROM build-env AS publish
RUN dotnet publish "SoundAnnoucementApp.csproj" -c Release -o /publish
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html
COPY --from=publish /publish/wwwroot /usr/local/webapp/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf