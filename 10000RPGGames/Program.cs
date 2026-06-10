using Microsoft.EntityFrameworkCore;
using _10000RPGGames.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS for frontend integration (React, Vue, Unity WebGL)
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJSPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure PostgreSQL with Entity Framework Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Development: allow HTTP - uncomment in production
// app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors("NextJSPolicy");

app.UseAuthorization();

// Automatic migration and seed data on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Use EnsureCreated for cloud databases like Neon PostgreSQL
    // This will create tables if they don't exist
    dbContext.Database.EnsureCreated();
}

// app.MapControllerRoute(
//     name: "default",
//     pattern: "api/game/{controller}/{action}/{id?}");

app.MapControllers();

app.Run();
