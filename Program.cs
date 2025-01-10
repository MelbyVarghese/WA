//-----------------------------------------------------------------------
// <copyright file="Program.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SpaServices.AngularCli;

var builder = WebApplication.CreateBuilder(args);
var BaseURL = builder.Configuration.GetValue<string>("APIBaseURL");

// Add services to the container.
builder.Services.AddHttpClient();
builder.Services.AddRouting();
builder.Services.AddControllersWithViews();

// CORS code - 298148
builder.Services.AddCors(p => p.AddPolicy("AllowOrigin", builder =>
{
    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
}));

builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Swagger
builder.Services.AddSwaggerGen();

builder.Services.AddSession(options => {
    options.IdleTimeout = TimeSpan.FromMinutes(60);
});
builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.Secure = CookieSecurePolicy.Always;
    options.HttpOnly = HttpOnlyPolicy.Always;
});

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/dist";
});

var app = builder.Build();



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//app.Use(async (context, next) =>
//{
//    context.Response.Headers.Add("X-Content-Type-Options", "no-sniff");
//    await next();
//});

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

// CORS Fix - 298148
app.UseCors(options => options
.AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithOrigins(BaseURL)
                    .SetIsOriginAllowed((host) => true)
                    .AllowCredentials());

app.UseSession();

// Swagger 
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("../swagger/v1/swagger.json", "CognizantOn API");
    });
}

app.UseCookiePolicy();

app.Use(async (context, next) =>
{
	context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = 367001600;
    await next();
}

    );

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

if (!app.Environment.IsDevelopment())
{
    app.UseSpaStaticFiles();

    app.UseSpa(spa =>
    {
        spa.Options.SourcePath = "ClientApp";

        if (app.Environment.IsDevelopment())
        {
            //spa.Options.StartupTimeout = new TimeSpan(0, 0, 200);
            spa.UseAngularCliServer(npmScript: "start");
        }
    });

}

app.MapFallbackToFile("3990/AdminModule/index.html"); 

app.Run();
