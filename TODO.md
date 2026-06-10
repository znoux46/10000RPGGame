# TODO List - RPG Point-and-Click Backend Implementation

## Step 1: Update .csproj - Add NuGet packages
- [x] Add Npgsql.EntityFrameworkCore.PostgreSQL
- [x] Add Microsoft.EntityFrameworkCore.Design

## Step 2: Create Models
- [x] Create Character.cs entity
- [x] Create Location.cs entity

## Step 3: Create DbContext
- [x] Create AppDbContext.cs

## Step 4: Update Program.cs
- [x] Configure PostgreSQL database
- [x] Configure CORS
- [x] Add EF Core services

## Step 5: Create API Controllers
- [x] Create CharactersController.cs
- [x] Create LocationsController.cs

## Step 6: Update appsettings.json
- [x] Add PostgreSQL connection string

## Step 7: Seed Data
- [x] Implement automatic seed for 3 default locations

## Build Status
- [x] Build succeeded

## Update for Next.js Integration
- [x] Updated API endpoints to /api/game/* format
- [x] Updated CORS to allow http://localhost:3000 only
- [x] Updated MoveRequest to include CharacterId and TargetLocationId

## Next.js Frontend (rpg-frontend)
- [x] Created API service (src/lib/api.ts)
- [x] Created CharacterCreate component
- [x] Created GameMap component with point-and-click
- [x] Updated main page with game flow
- [x] Configured dark theme styling
