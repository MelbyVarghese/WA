using Microsoft.AspNetCore.Mvc;

namespace CognizantOn_Admin.Controllers
{
    using Azure.Core;
    using CognizantOn_Admin.Models;
    using Microsoft.AspNetCore.Mvc.Filters;
    using System.Web;
    //using Microsoft.AspNetCore.Authorization;
    //using Microsoft.AspNetCore.Mvc;
    using System.Web.Http;

    /// <summary>
    /// Base Controller
    /// </summary>
    [AllowAnonymous]
    public abstract class BaseController : ControllerBase
    {
        public BaseController() { }
    }

}
