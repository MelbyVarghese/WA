#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM ctsinazacrpd1c02.azurecr.io/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 8080

COPY CognizantOn_Admin/cognizantca.pem /etc/ssl/certs/
RUN update-ca-certificates

RUN groupadd --g 5000 appuser && \
    useradd -r -u 5000 -g appuser appuser
USER appuser

FROM ctsinazacrpd1c02.azurecr.io/dotnet/sdkangular:6.0 AS build
WORKDIR /src
COPY ["CognizantOn_Admin/CognizantOn_Admin.csproj", "CognizantOn_Admin/"]
RUN dotnet restore "CognizantOn_Admin/CognizantOn_Admin.csproj"
COPY . .
WORKDIR "/src/CognizantOn_Admin"
RUN dotnet build "CognizantOn_Admin.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CognizantOn_Admin.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CognizantOn_Admin.dll"]
ENV ASPNETCORE_URLS=http://*:8080