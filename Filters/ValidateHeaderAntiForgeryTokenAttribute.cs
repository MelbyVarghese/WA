using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Filters;


namespace CognizantOn_Admin.Filters
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public sealed class ValidateHeaderAntiForgeryTokenAttribute : FilterAttribute, IAsyncAuthorizationFilter
    {
        public ValidateHeaderAntiForgeryTokenAttribute()
        {

        }

        public Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            if (context == null)
            {
                context.Result = new BadRequestResult();
            }

            var httpContext = context.HttpContext;
            var ctok = httpContext.Request.Cookies["XSRF-TOKEN"];
            var token = httpContext.Request.Headers["X-XSRF-TOKEN"];
            bool validation = validateAntiForgeryKey(ctok, token);
            if (!validation)
            {
                context.Result = new BadRequestResult();
            }

            return Task.CompletedTask;
        }

        public bool validateAntiForgeryKey(string APItoken, string ClientToken)
        {
            if (string.IsNullOrEmpty(ClientToken))
            {
                return false;
            }

            if (string.IsNullOrEmpty(APItoken))
            {
                return false;
            }

            if (APItoken == ClientToken)
            {
                return true;
            }
            else
            {
                return false;
            }
        }


    }
}
