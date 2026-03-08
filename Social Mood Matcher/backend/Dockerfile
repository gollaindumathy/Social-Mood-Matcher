# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY *.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install sqlite3 (for seed script DB queries) and curl (for health-check polling)
RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create directory for SQLite DB file
RUN mkdir -p /app/data

COPY --from=build /app/publish .

# Copy and make the seed entrypoint executable
COPY seed.sh /app/seed.sh
RUN chmod +x /app/seed.sh

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["/app/seed.sh"]
