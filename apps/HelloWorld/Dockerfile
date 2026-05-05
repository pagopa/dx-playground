FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ./apps/HelloWorld ./
RUN dotnet restore HelloWorld.csproj
RUN dotnet publish HelloWorld.csproj \
    --configuration Release \
    --output /out \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /out/ ./

ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "HelloWorld.dll"]
