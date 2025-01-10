//-----------------------------------------------------------------------
// <copyright file="LoginController.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Controllers
{
    using CognizantOn_Admin.Constants;
    using CognizantOn_Admin.Filters;
    using CognizantOn_Admin.Helper;
    using CognizantOn_Admin.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Configuration;
    using Newtonsoft.Json;
    using System.Security.Cryptography.Xml;
    using System.Text;
    using System.Web;

    /// <summary>
    /// 298148 : Login Controller
    /// </summary>
    [Route("3990/AdminModule/api/[controller]/[action]")]
    public class LoginController : BaseController
    {
        /// <summary>
        /// HTTP client Interface
        /// </summary>
        // private readonly IHttpClientFactory httpClientFactory;


        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// Gets or sets AssociateID
        /// </summary>
        public string associateId = string.Empty;

        public DistributedCacheService distributedCacheService;
        /// <summary>
        /// Configuration Interface
        /// </summary>
        private IConfiguration configurations;

        /// <summary>
        /// Configuration - Appsetting json 
        /// </summary>
        /// <param name="iconfig"></param>
        public LoginController(IConfiguration iconfig)
        {
            configurations = iconfig;
            distributedCacheService = new DistributedCacheService(iconfig);
        }

        #region GetAssociateID
        /// <summary>11111111111111111111111111
        /// Method to get associate role
        /// </summary>
        /// <param name="associateId">Associate Id</param>
        /// <returns>Returns associate role</returns>
        [HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetAssociateID(string qsEncValue)
        {
            bool getLoggedInUserDetails;
            var IsPTEnv = configurations.GetValue<bool>("IsPTEnv");
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            //Original query params
            string associateID = decrypted["associateID"];
            getLoggedInUserDetails = Convert.ToBoolean(decrypted["getLoggedInUserDetails"]);
            associateID = objSanitizer.InputSanitizer(associateID);
            string headerID = string.Empty;
            //associateID = "280826"; //for testing 
            //getLoggedInUserDetails =  false;  //for testing 

            // string headerID = string.Empty;

            if (!string.IsNullOrEmpty(Request.Headers["AKSUserId"]) && getLoggedInUserDetails == true)
            {
                headerID = objSanitizer.InputSanitizer(Request.Headers["AKSUserId"].ToString());
            }
            //else if(IsPTEnv)
            //{
            //    var ProxyAssociateId = configurations.GetValue<string>("PTProxyAssociateId");
            //    headerID = ProxyAssociateId;
            //}
            else
            {
                headerID = associateID;

            }

            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
            {
                LoginResponse loginResponse = new LoginResponse();
                string queryString = "?loginid=" + headerID;
                HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.Login + queryString);

                if (response != null && response.IsSuccessStatusCode)
                {
                    var result = response.Content.ReadAsStringAsync().Result;
                    loginResponse = JsonConvert.DeserializeObject<LoginResponse>(result);
                    if (loginResponse != null)
                    {
                        if (string.IsNullOrEmpty(distributedCacheService.GetUserCacheAsync<string>(headerID, "LoginId", HttpContext).GetAwaiter().GetResult()))
                        {
                            distributedCacheService.SetUserCacheAsync(headerID, "LoginId", headerID, HttpContext).GetAwaiter().GetResult();
                            distributedCacheService.SetUserCacheAsync(headerID, "Role", loginResponse.RoleType, HttpContext).GetAwaiter().GetResult();
                        }
                        
                        //distributedCacheService.SetUserCacheAsync(GetLoggedUserId(), "Role", loginResponse.RoleType, HttpContext).GetAwaiter().GetResult();

                        string encryptedLoginResponse = objSanitizer.EncryptResponseData(loginResponse, configurations);
                        if (!String.IsNullOrEmpty(encryptedLoginResponse) || !encryptedLoginResponse.Contains("Encryption Error"))
                        {
                            EncryptValues env = new EncryptValues();
                            env.EncryptedValue = encryptedLoginResponse;
                            return env;
                        }
                        else
                        {
                            return new BadRequestResult();

                        }
                    }
                    else
                    {
                        return new BadRequestResult();
                    }

                }
                else
                {
                    return new BadRequestResult();
                }
            }
        }
        #endregion

        #region GetCSRF Token

        [HttpGet("GetCSRFToken")]
        public async Task<TokenResponse> GetCSRFToken()
        {
            return new TokenResponse()
            {
                TokenValue = string.Empty,
                Session_Key = configurations.GetValue<string>("Session_Key"),
                IsPTEnv = configurations.GetValue<bool>("IsPTEnv"),
                ProxyUserId = configurations.GetValue<string>("PTProxyAssociateId")
            };
        }
        #endregion

        #region GetEncryptToken

        [HttpGet("GetEncryptToken")]
        public async Task<EncryptKeys> GetEncryptToken()
        {
            string key = string.Empty;
            key = configurations.GetValue<string>("ClientIdkey") + "_" + configurations.GetValue<string>("ClientIdIV");
            byte[] keyvalue = Encoding.UTF8.GetBytes(key);
            return new EncryptKeys()
            {
                EdInfo = Convert.ToBase64String(keyvalue)

            };
        }
        #endregion

        //[Microsoft.AspNetCore.Mvc.ValidateAntiForgeryToken]
        //public string GetLoggedUserId()
        //{
        //    associateId = string.Empty;
        //    InputSanitization objSanitizer = new InputSanitization();
        //    try
        //    {
        //        if (Request != null && !string.IsNullOrEmpty(Request.Headers["AKSUserId"]))
        //        {
        //            associateId = objSanitizer.InputSanitizer(Request.Headers["AKSUserId"].ToString());
        //        }
        //        else
        //        {
        //            associateId = "";
        //        }              
        //        return associateId;
        //    }
        //    catch (Exception ex)
        //    {
        //        return associateId;
        //    }
        //}

        [Microsoft.AspNetCore.Mvc.ValidateAntiForgeryToken]
        public string GetLoggedUserId()
        {
            associateId = string.Empty;
            try
            {

                //!string.IsNullOrEmpty(Request.Headers["AKSUserId"]))
                if (Request != null && !string.IsNullOrEmpty(Request.Headers["AKSUserId"]))
                {
                    associateId = HttpUtility.HtmlEncode(Request.Headers["AKSUserId"].ToString());
                }
                else
                {
                    associateId = "616098"; //"304630";
                }
                return associateId;
            }
            catch (Exception ex)
            {
                return associateId;
            }
        }


    }
}
