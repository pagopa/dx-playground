FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ./apps/HelloWorld ./
RUN dotnet restore HelloWorld.csproj
RUN dotnet publish HelloWorld.csproj \
    --configuration Release \
    --output /out \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

ARG COMMIT_SHA

WORKDIR /app

COPY --from=build /out/ ./

ENV ASPNETCORE_URLS=http://+:80

EXPOSE 80
ENV SHA=$COMMIT_SHA

ENTRYPOINT ["dotnet", "HelloWorld.dll"]
