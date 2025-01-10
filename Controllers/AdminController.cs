//-----------------------------------------------------------------------
// <copyright file="AdminController.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Controllers
{
    using CognizantOn_Admin.Constants;
    using CognizantOn_Admin.Filters;
    using CognizantOn_Admin.Helper;
    using CognizantOn_Admin.Models;
    using CognizantOn_Admin.Models.InputModel;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Configuration;
    using Newtonsoft.Json;
    using System;
    using System.Net.Http;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;

    /// <summary>
    /// 298148 : Admin Controller
    /// </summary>
    [Route("3990/AdminModule/api/[controller]/[action]")]
    public class AdminController : BaseController
    {
        /// <summary>
        /// HTTP client Interface
        /// </summary>
        private readonly IHttpClientFactory httpClientFactory;

        public DistributedCacheService distributedCacheService;
        //public LoginController logindetails;

        /// <summary>
        /// Configuration Interface
        /// </summary>
        private IConfiguration configurations;

        private string associateId;
        /// <summary>
        /// Configuration - Appsetting json 
        /// </summary>
        /// <param name="iconfig"></param>
        public AdminController(IConfiguration iconfig)
        {
            configurations = iconfig;
           // logindetails = new LoginController(iconfig);
            distributedCacheService = new DistributedCacheService(iconfig);
            //logindetails.associateId = logindetails.GetLoggedUserId();
        }

        #region GetNewJoinerIds
        /// <summary>
        /// 298148 GET NEW JOINER LIST FOR ASSIMILATION IN PROGRESS
        /// </summary>
        /// <returns>Emp List</returns>
        [HttpPost]
        public async Task<ActionResult<EncryptValues>> GetNewJoinerIds([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] NewJoinersList njList;
            string loginId;          
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["associateID"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("Role");
            if (SessionRoleType == "Admin" || SessionRoleType == "Super Admin")
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> emplist = new List<NewJoinersList>();
                    //var jsonval = JsonConvert.SerializeObject(njList);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.AdminNewJoiner, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        emplist = JsonConvert.DeserializeObject<List<NewJoinersList>>(result);
                        //emplist = JsonConvert.DeserializeObject<NewJoinersList>(result);
                        if (emplist != null)
                        {
                            string encryptedCandlist = objSanitizer.EncryptResponseData(emplist, configurations);
                            if (!String.IsNullOrEmpty(encryptedCandlist) && !encryptedCandlist.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedCandlist;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetCandidateList
        /// <summary>
        /// 298148 - GET NEW JOINER LIST FOR ASSIMILATION IN PROGRESS
        /// </summary>
        /// <returns>Emp List</returns>
        [HttpPost]
        public async Task<ActionResult<EncryptValues>> GetCandidateList([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] CandidateList cdList;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["associateID"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");          
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionRoleType == "Admin" || SessionRoleType == "Super Admin")
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<CandidateList> candlist = new List<CandidateList>();
                    //var jsonval = JsonConvert.SerializeObject(cdList);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.AdminCandidate, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        candlist = JsonConvert.DeserializeObject<List<CandidateList>>(result);
                        if (candlist != null)
                        {
                            string encryptedCandlist = objSanitizer.EncryptResponseData(candlist, configurations);
                            if (!String.IsNullOrEmpty(encryptedCandlist) && !encryptedCandlist.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedCandlist;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetFilteredDetails
        /// <summary>
        /// 298148 - GET FILTERED DETAILS
        /// </summary>
        /// <param name="filterList"></param>
        /// <param name="isNewJoiner"></param>
        /// <param name="loginId"></param>
        /// <returns>Filter New joiner and Candidate List</returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetFilteredDetails([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original query params
            int? isNewJoiner;
            string loginId;
            //fbEncValue = "eaXWTq3ZBHgbmxy8ON4eBD3ImDuM8uKPnoV3FcWhSmyIEn1W3HQ6hiJrwGE+J045KKifN/SHsWLBtocxzKO8A3bl56qhglC2BGQlBFQrW6jLVCZ7F6f3ZbNGtNFWhZFY";
            //qsEncValue = "kWn9YZkzKkQRUfT5mqGpyT7Z2WLb5bEnuJFqLHUliBmg9HojxCiVkWTckLxqVGrD";
            EncryptValues encVal = new EncryptValues();
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            isNewJoiner = decryptedqsEncValue["isNewJoiner"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?isNewJoiner=" + isNewJoiner + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(filterList);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.GetFilteredDetails + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        filteredData = JsonConvert.DeserializeObject<List<NewJoinersList>>(result);
                        if (filteredData != null)
                        {
                            string encryptedMatserList = objSanitizer.EncryptResponseData(filteredData, configurations);
                            if (!String.IsNullOrEmpty(encryptedMatserList) && !encryptedMatserList.Contains("Encryption Error"))
                            {
                                //qsEncValue.EncryptedValue = encryptedMatserList;
                                encVal.EncryptedValue = encryptedMatserList;
                                //encVal.EncryptedValue = "In Admin Controller GetFilteredDetails Method Valid Request From Session Values:" + "LoginId:" + associateId + "RoleType:"+ role;
                                //List<EncryptValues> returnEnryptlist = new List<EncryptValues> { qsEncValue };
                                return encVal;
                                //List<EncryptValues> returnEnryptlist = new List<EncryptValues> { qsEncValue };
                                //return returnEnryptlist;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region GetFilteredDetails
        /// <summary>
        /// 298148 - GET FILTERED DETAILS
        /// </summary>
        /// <param name="filterList"></param>
        /// <param name="isNewJoiner"></param>
        /// <param name="loginId"></param>
        /// <returns>Filter New joiner and Candidate List</returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetFilteredDetailsAdminList([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original query params
            int? isNewJoiner;
            string loginId;
            //fbEncValue = "eaXWTq3ZBHgbmxy8ON4eBD3ImDuM8uKPnoV3FcWhSmyIEn1W3HQ6hiJrwGE+J045KKifN/SHsWLBtocxzKO8A3bl56qhglC2BGQlBFQrW6jLVCZ7F6f3ZbNGtNFWhZFY";
            //qsEncValue = "kWn9YZkzKkQRUfT5mqGpyT7Z2WLb5bEnuJFqLHUliBmg9HojxCiVkWTckLxqVGrD";
            EncryptValues encVal = new EncryptValues();
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            //dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            isNewJoiner = decryptedqsEncValue["isNewJoiner"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");

            //string apibaseURL = "https://localhost:7146/CognizantOn/";
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?isNewJoiner=" + isNewJoiner + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(filterList);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.GetFilteredDetailsAdminList + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        filteredData = JsonConvert.DeserializeObject<List<NewJoinersList>>(result);
                        if (filteredData != null)
                        {
                            string encryptedMatserList = objSanitizer.EncryptResponseData(filteredData, configurations);
                            if (!String.IsNullOrEmpty(encryptedMatserList) && !encryptedMatserList.Contains("Encryption Error"))
                            {
                                //qsEncValue.EncryptedValue = encryptedMatserList;
                                encVal.EncryptedValue = encryptedMatserList;
                                //encVal.EncryptedValue = "In Admin Controller GetFilteredDetails Method Valid Request From Session Values:" + "LoginId:" + associateId + "RoleType:"+ role;
                                //List<EncryptValues> returnEnryptlist = new List<EncryptValues> { qsEncValue };
                                return encVal;
                                //List<EncryptValues> returnEnryptlist = new List<EncryptValues> { qsEncValue };
                                //return returnEnryptlist;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
		#endregion

		#region GetDownloadedReport
		/// <summary>
		/// 298148 - GET FILTERED DETAILS
		/// </summary>
		/// <param name="filterList"></param>
		/// <param name="isNewJoiner"></param>
		/// <param name="loginId"></param>
		/// <returns>Filter New joiner and Candidate List</returns>
		[HttpPost]
		[ValidateHeaderAntiForgeryToken]
		public async Task<ActionResult<EncryptValues>> GetDownloadedReport([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
		{
			//Original query params
			int? isNewJoiner;
			string loginId;
			//fbEncValue = "eaXWTq3ZBHgbmxy8ON4eBD3ImDuM8uKPnoV3FcWhSmyIEn1W3HQ6hiJrwGE+J045KKifN/SHsWLBtocxzKO8A3bl56qhglC2BGQlBFQrW6jLVCZ7F6f3ZbNGtNFWhZFY";
			//qsEncValue = "kWn9YZkzKkQRUfT5mqGpyT7Z2WLb5bEnuJFqLHUliBmg9HojxCiVkWTckLxqVGrD";
			EncryptValues encVal = new EncryptValues();
			InputSanitization objSanitizer = new InputSanitization();
			dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
			dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
			loginId = decryptedqsEncValue["loginId"];
			isNewJoiner = decryptedqsEncValue["isNewJoiner"];
			loginId = objSanitizer.InputSanitizer(loginId);
			string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
			string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
			//HttpContext.Session.GetString("LoginId");
			//HttpContext.Session.GetString("Role");
			string apibaseURL = configurations.GetValue<string>("APIBaseURL");
			if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
			{
				using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
				{
					List<DownloadedNewJoinerList> filteredData = new List<DownloadedNewJoinerList>();
					string queryString = "?isNewJoiner=" + isNewJoiner + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
					//var jsonval = JsonConvert.SerializeObject(filterList);
					var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
					var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
					HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.GetDownloadedAssimilationlist + queryString, content);

					if (response != null && response.IsSuccessStatusCode)
					{
						var result = response.Content.ReadAsStringAsync().Result;
						filteredData = JsonConvert.DeserializeObject<List<DownloadedNewJoinerList>>(result);
						if (filteredData != null)
						{
							string encryptedMatserList = objSanitizer.EncryptResponseData(filteredData, configurations);
							if (!String.IsNullOrEmpty(encryptedMatserList) && !encryptedMatserList.Contains("Encryption Error"))
							{
								//qsEncValue.EncryptedValue = encryptedMatserList;
								encVal.EncryptedValue = encryptedMatserList;
								//encVal.EncryptedValue = "In Admin Controller GetFilteredDetails Method Valid Request From Session Values:" + "LoginId:" + associateId + "RoleType:"+ role;
								//List<EncryptValues> returnEnryptlist = new List<EncryptValues> { qsEncValue };
								return encVal;
								//List<EncryptValues> returnEnryptlist = new List<EncryptValues> { qsEncValue };
								//return returnEnryptlist;
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
			else
			{
				return new UnauthorizedResult();
			}

		}
		#endregion


		#region GetMasterList
		/// <summary>
		/// 298148 - GET MASTER DATA LIST FOR ADMIN SCREENS
		/// </summary>
		/// <returns>Master Data List</returns>
		[HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetMasterList(string qsEncValue)
        {
            string loginId = string.Empty;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["associateID"];
            loginId = objSanitizer.InputSanitizer(loginId);

            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("Role");
            if (SessionRoleType == "Admin" || SessionRoleType == "Super Admin")
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    Master masterlist = new Master();
                    // string queryString = "?loginid=" + associateID;
                    HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.Master);
                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        masterlist = JsonConvert.DeserializeObject<Master>(result);
                        if (masterlist != null)
                        {
                            string encryptedMatserList = objSanitizer.EncryptResponseData(masterlist, configurations);
                            if (!String.IsNullOrEmpty(encryptedMatserList) || encryptedMatserList.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedMatserList;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region SetCorpInduction
        /// <summary>
        /// 298148 - SET CORPORATE INDUCTION
        /// </summary>
        /// <param name="corpInds">Selected Ids</param>
        /// <param name="LoginId">Login ID</param>
        /// <returns>Success Status</returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> SetCorpInduction([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);

            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);

                    //var jsonval = JsonConvert.SerializeObject(corpInds);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);

                    var content = new StringContent(jsonval, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.SetCorporateInduction + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        result = JsonConvert.SerializeObject(result);

                        if (result != null)
                        {
                            string encryptedMileStones = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedMileStones) && !encryptedMileStones.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedMileStones;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetAssociateSessionList
        /// <summary>
        /// 298148 - SET CORPORATE INDUCTION
        /// </summary>
        /// <param name="corpInds">Selected Ids</param>
        /// <param name="LoginId">Login ID</param>
        /// <returns>Session tasks</returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetAssociateSessionList([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            string loginId;
            List<SessionTaskList> sessionTaskLists = new List<SessionTaskList>();
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);

            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);

            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);

                    var content = new StringContent(jsonval, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.GetAssociateSessionList + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        sessionTaskLists = JsonConvert.DeserializeObject<List<SessionTaskList>>(result);

                        if (sessionTaskLists != null)
                        {
                            string encryptedMileStones = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedMileStones) && !encryptedMileStones.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedMileStones;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetAssociateAssimilationProgress
        /// <summary>
        /// 298148 - GET ASSOCIATE ASSIMILATION PROGRESS
        /// </summary>
        /// <returns>Associate Assimilation Progress</returns>
        [HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetAssociateAssimilationProgress(string qsEncValue)
        {
            //Original Params
            string associateID;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            associateID = decrypted["associateID"];
            associateID = objSanitizer.InputSanitizer(associateID);
            loginId = decrypted["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            AssociateAssimilationProgress aspProgress = new AssociateAssimilationProgress();
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionRoleType == "Admin" || SessionRoleType == "Super Admin")
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    LoginResponse loginResponse = new LoginResponse();
                    string queryString = "?associateID=" + Microsoft.Security.Application.Encoder.HtmlEncode(associateID);
                    HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.AssimilationProgress + queryString);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        aspProgress = JsonConvert.DeserializeObject<AssociateAssimilationProgress>(result);
                        if (aspProgress != null)
                        {
                            string encryptedAspProgresst = objSanitizer.EncryptResponseData(aspProgress, configurations);
                            if (!String.IsNullOrEmpty(encryptedAspProgresst) && !encryptedAspProgresst.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedAspProgresst;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetAPTemplates
        /// <summary>
        /// 298148 - GET ASSIMILATION TEMPLATE LIST
        /// </summary>
        /// <param name="associateId"></param>
        /// <returns>List</returns>
        //[HttpGet]
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetAPTemplates(string qsEncValue)
        {
            //Original query params
            int? planId;
            string loginId;
            //ev = "gm94yP7CTXFKzOsR8FmXTAXwz8Rwwt1wFVT0eEtqn92AZLgtmid2r3IB/2JrQxvO";

            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            planId = (decrypted["planId"] == "") ? 0 : decrypted["planId"];
            loginId = decrypted["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (loginId == SessionLoginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<APTemplate> aPTemplate = new List<APTemplate>();
                    string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.TemplateList + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        aPTemplate = JsonConvert.DeserializeObject<List<APTemplate>>(result);
                        if (aPTemplate != null)
                        {
                            string encryptedaPTemplate = objSanitizer.EncryptResponseData(aPTemplate, configurations);
                            if (encryptedaPTemplate != null)
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedaPTemplate;

                                //// List<EncryptValues> returnEnryptlist = new List<EncryptValues> { env };
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region DeleteAP
        /// <summary>
        /// DELETE ASSIMILATION PLAN
        /// </summary>
        /// <returns>Master Class Object</returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> DeleteAP(string qsEncValue)
        {
            //Original Params
            int planId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            planId = decrypted["planId"];
            loginId = objSanitizer.InputSanitizer(loginId);

            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
            HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.DeleteAssimPlan + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedResult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedResult) && !encryptedResult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedResult;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region GetWelcomeEmail
        /// <summary>
        /// 298148 - GET WELCOME EMAIL TEMPLATE
        /// </summary>
        /// <param name="associateId"></param>
        /// <param name="PlanId"></param>
        /// <returns>Mail Template</returns>
        [HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetWelcomeEmail(string qsEncValue)
        {
            //Original Params
            string associateId;
            int planId;

            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            associateId = decrypted["associateId"];
            planId = decrypted["planId"];
            associateId = objSanitizer.InputSanitizer(associateId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(associateId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(associateId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == associateId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                if (!string.IsNullOrEmpty(associateId) && planId >= 0)
                {
                    string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                    using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                    {
                        List<WelcomeEmailTemplate> wcEmail = new List<WelcomeEmailTemplate>();
                        string queryString = "?associateId=" + Microsoft.Security.Application.Encoder.HtmlEncode(associateId) + "&" + "planId=" + planId;
                        HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.GetWelcomeEmail + queryString);

                        if (response != null && response.IsSuccessStatusCode)
                        {
                            var result = response.Content.ReadAsStringAsync().Result;
                            wcEmail = JsonConvert.DeserializeObject<List<WelcomeEmailTemplate>>(result);
                            if (wcEmail != null)
                            {
                                string encryptedWcEmail = objSanitizer.EncryptResponseData(wcEmail, configurations);
                                if (!String.IsNullOrEmpty(encryptedWcEmail) && !encryptedWcEmail.Contains("Encryption Error"))
                                {
                                    EncryptValues env = new EncryptValues();
                                    env.EncryptedValue = encryptedWcEmail;
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
                else
                {
                    return new BadRequestResult();
                }
            }
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region UpdateWelcomeEmail
        /// <summary>
        /// 298148 - UPDATE WELCOME EMAIL
        /// </summary>
        /// <param name="welcomeEmailTemplate"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> UpdateWelcomeEmail([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] WelcomeEmailTemplate welcomeEmailTemplate,
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(welcomeEmailTemplate);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.UpdateWelcomeEmail + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedResult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedResult) && !encryptedResult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedResult;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region SaveAPTitle
        /// <summary>
        /// 298148 - SAVE ASSIGN PLAN Title
        /// </summary>
        /// <param name="aPTitleIn"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> SaveAPTitle([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] APTitleIn aPTitleIn;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(aPTitleIn);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.SaveAPTitle + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedResult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedResult) && !encryptedResult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedResult;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetDurationDetails
        /// <summary>
        /// 298148 - GET DURATION DETAILS
        /// </summary>
        /// <param name="loginId"></param>
        /// <returns>DURATION LIST</returns>
        [HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetDurationDetails(string qsEncValue)
        {
            //Original Params 
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            Regex regex = new Regex("^[0-9]+$");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                if (regex.IsMatch(loginId))
                {
                    DurationDetailsMaster durationDetailsMaster = new DurationDetailsMaster();

                    string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                    using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                    {
                        LoginResponse loginResponse = new LoginResponse();
                        string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                        HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.GetDurationDetails + queryString);

                        if (response != null && response.IsSuccessStatusCode)
                        {
                            var result = response.Content.ReadAsStringAsync().Result;
                            durationDetailsMaster = JsonConvert.DeserializeObject<DurationDetailsMaster>(result);
                            if (durationDetailsMaster != null)
                            {
                                string encryptedDurationDetailsMaster = objSanitizer.EncryptResponseData(durationDetailsMaster, configurations);
                                if (!String.IsNullOrEmpty(encryptedDurationDetailsMaster) && !encryptedDurationDetailsMaster.Contains("Encryption Error"))
                                {
                                    EncryptValues env = new EncryptValues();
                                    env.EncryptedValue = encryptedDurationDetailsMaster;
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
                else
                {
                    return new BadRequestResult();
                }
            }
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region AddMileStone
        /// <summary>
        /// 298148 - ADD MILE STONE DETAILS
        /// </summary>
        /// <param name="mileStone"></param>
        /// <param name="loginId"></param>
        /// <returns>Milestone List</returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> AddMileStone([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Param
            //[FromBody] MileStone mileStone;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<MileStoneDetails> mileStones = new List<MileStoneDetails>();
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(mileStone);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.AddMileStone + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        mileStones = JsonConvert.DeserializeObject<List<MileStoneDetails>>(result);
                        if (mileStones != null)
                        {
                            string encryptedMileStones = objSanitizer.EncryptResponseData(mileStones, configurations);
                            if (!String.IsNullOrEmpty(encryptedMileStones) && !encryptedMileStones.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedMileStones;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region EditMileStone
        /// <summary>
        /// 298148 - EDIT MILE STONE
        /// </summary>
        /// <param name="mileStone"></param>
        /// <param name="loginId"></param>
        /// <returns>MILESTONE LIST</returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> EditMileStone([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] MileStone mileStone;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            Regex regex = new Regex("^[0-9]+$");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                if (regex.IsMatch(loginId))
                {
                    if (!string.IsNullOrEmpty(loginId))
                    {
                        string apibaseURL = configurations.GetValue<string>("APIBaseURL");

                        using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                        {
                            client.BaseAddress = new Uri(apibaseURL);
                            List<MileStoneDetails> mileStones = new List<MileStoneDetails>();
                            string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                            //var jsonval = JsonConvert.SerializeObject(mileStone);
                            var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                            var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                            HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.EditMileStone + queryString, content);

                            if (response != null && response.IsSuccessStatusCode)
                            {
                                var result = response.Content.ReadAsStringAsync().Result;
                                mileStones = JsonConvert.DeserializeObject<List<MileStoneDetails>>(result);
                                if (mileStones != null)
                                {
                                    string encryptedMileStones = objSanitizer.EncryptResponseData(mileStones, configurations);
                                    if (!String.IsNullOrEmpty(encryptedMileStones) && !encryptedMileStones.Contains("Encryption Error"))
                                    {
                                        EncryptValues env = new EncryptValues();
                                        env.EncryptedValue = encryptedMileStones;
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
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region DeleteMileStone
        /// <summary>
        /// 298148 - DELETE MILESTONE
        /// </summary>
        /// <param name="mileStoneId"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> DeleteMileStone(string qsEncValue)
        {
            int mileStoneId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            mileStoneId = decrypted["mileStoneId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string queryString = "?mileStoneId=" + mileStoneId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
            HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.DeleteMileStone + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedResult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedResult) && !encryptedResult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedResult;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetTaskMasterDetails
        /// <summary>
        /// 298148 - GET TASK MASTER DETAILS
        /// </summary>
        /// <param name="loginId"></param>
        /// <returns>Task Master List</returns>
        [HttpGet]
        public async Task<ActionResult<EncryptValues>> GetTaskMasterDetails(string qsEncValue)
        {

            int isManagerTask;
            string loginId;
            string planid;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            isManagerTask = decrypted["isManagerTask"];
            planid = decrypted["planId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            planid = objSanitizer.InputSanitizer(planid);
            Regex regex = new Regex("^[0-9]+$");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                if (regex.IsMatch(loginId))
                {
                    string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                    using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                    {
                        TaskMasterDetails taskMaster = new TaskMasterDetails();
                        string queryString = "?isManagerTask=" + isManagerTask + "&"
                            + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId) + "&"
                            + "planid=" + planid;
                        HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.GetTaskMasterDetails + queryString);

                        if (response != null && response.IsSuccessStatusCode)
                        {
                            var result = response.Content.ReadAsStringAsync().Result;
                            taskMaster = JsonConvert.DeserializeObject<TaskMasterDetails>(result);
                            if (taskMaster != null)
                            {
                                string encryptedtaskMaster = objSanitizer.EncryptResponseData(taskMaster, configurations);
                                if (!String.IsNullOrEmpty(encryptedtaskMaster) && !encryptedtaskMaster.Contains("Encryption Error"))
                                {
                                    EncryptValues env = new EncryptValues();
                                    env.EncryptedValue = encryptedtaskMaster;
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
                else
                {
                    return new BadRequestResult();
                }
            }
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region AddSelectedTask
        /// <summary>
        /// 298148 - ADD SELECTED TASK
        /// </summary>
        /// <param name="task"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<EncryptValues>> AddSelectedTask([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] SelectedTaskIn task;
            int mileStoneId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            mileStoneId = decryptedqsEncValue["mileStoneId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            SelectedTask selectedtask = new SelectedTask();
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?mileStoneId=" + mileStoneId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(task);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.AddSelectedTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        selectedtask = JsonConvert.DeserializeObject<SelectedTask>(result);
                        if (selectedtask != null)
                        {
                            string encryptedSelectedtask = objSanitizer.EncryptResponseData(selectedtask, configurations);
                            if (!String.IsNullOrEmpty(encryptedSelectedtask) && !encryptedSelectedtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedSelectedtask;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region EditTask
        /// <summary>
        /// 298148 - EDIT TASK
        /// </summary>
        /// <param name="task"></param>
        /// <param name="loginId"></param>
        /// <returns>Returns Edited Task</returns>
        [HttpPost]
        public async Task<ActionResult<EncryptValues>> EditTask([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] SelectedTaskIn task;
            int mileStoneId;
            string loginId;

            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            mileStoneId = decryptedqsEncValue["mileStoneId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            SelectedTask selectedtask = new SelectedTask();
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?mileStoneId=" + mileStoneId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(task);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.EditTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        selectedtask = JsonConvert.DeserializeObject<SelectedTask>(result);
                        if (selectedtask != null)
                        {
                            string encryptedSelectedtask = objSanitizer.EncryptResponseData(selectedtask, configurations);
                            if (!String.IsNullOrEmpty(encryptedSelectedtask) && !encryptedSelectedtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedSelectedtask;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region DeleteTask
        /// <summary>
        /// 298148 - DELETE TASK
        /// </summary>
        /// <param name="selectedTaskId"></param>
        /// <param name="loginId"></param>
        /// <returns></returnsdeleteCustomTask
        [HttpPost]
        public async Task<ActionResult<EncryptValues>> DeleteTask(string qsEncValue)
        {
            //Original Params
            int taskId;
            int isManagerTask;
            string loginId;
            int activeStatus;

            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            isManagerTask = decrypted["isManagerTask"];
            taskId = decrypted["taskId"];
            activeStatus = decrypted["activeStatus"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string queryString = "?taskId=" + taskId + "&" + "isManagerTask=" + isManagerTask + "&"
                + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId) + "&"
                + "activeStatus=" + activeStatus;
            HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.DeleteTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedresult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedresult) && !encryptedresult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedresult;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region AddCustomTask
        /// <summary>
        /// 298148 - ADD CUSTOM TASK
        /// </summary>
        /// <param name="ctask"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<EncryptValues>> AddCustomTask([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] CustomTaskIn ctask,
            int mileStoneId;
            string loginId;

            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            mileStoneId = decryptedqsEncValue["mileStoneId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            SelectedTask selectedtask = new SelectedTask();
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?mileStoneId=" + mileStoneId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(ctask);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.AddCustomTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        selectedtask = JsonConvert.DeserializeObject<SelectedTask>(result);
                        if (selectedtask != null)
                        {
                            string encryptedSelectedtask = objSanitizer.EncryptResponseData(selectedtask, configurations);
                            if (!String.IsNullOrEmpty(encryptedSelectedtask) && !encryptedSelectedtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedSelectedtask;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region EditCustomTask
        /// <summary>
        /// 298148 - EDIT CUSTOM TASK
        /// </summary>
        /// <param name="edittask"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> EditCustomTask([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] CustomTaskIn edittask,
            int? mileStoneId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            mileStoneId = decryptedqsEncValue["mileStoneId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            SelectedTask selectedtask = new SelectedTask();
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?mileStoneId=" + mileStoneId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(edittask);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.EditCustomTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        selectedtask = JsonConvert.DeserializeObject<SelectedTask>(result);
                        if (selectedtask != null)
                        {
                            string encryptedSelectedtask = objSanitizer.EncryptResponseData(selectedtask, configurations);
                            if (!String.IsNullOrEmpty(encryptedSelectedtask) && !encryptedSelectedtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedSelectedtask;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region DeleteCustomTask
        /// <summary>
        /// 547827 - DELETE CUSTOM TASK
        /// </summary>
        /// <param name="customTaskId"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> DeleteCustomTask(string qsEncValue)
        {
            int? customTaskId;
            int? isManagerTask;
            string loginId;
            int? activeStatus;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            isManagerTask = decrypted["isManagerTask"];
            customTaskId = decrypted["customTaskId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            activeStatus = decrypted["activeStatus"];
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string queryString = "?customTaskId=" + customTaskId + "&" + "isManagerTask=" + isManagerTask + "&"
                + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId) + "&"
                + "activeStatus=" + activeStatus;
            HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.DeleteCustomTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedresult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedresult) && !encryptedresult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedresult;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region AddSessionTask
        /// <summary>
        /// 2228166 - ADD SESSION TASK
        /// </summary>
        /// <param name="sstask"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> AddSessionTask([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] SessionTaskIn sstask,
            int mileStoneId;
            string loginId;
            SessionTask sessionTask = new SessionTask();
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            mileStoneId = decryptedqsEncValue["mileStoneId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?mileStoneId=" + mileStoneId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(ctask);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.AddSessionTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        sessionTask = JsonConvert.DeserializeObject<SessionTask>(result);
                        if (sessionTask != null)
                        {
                            string encryptedSelectedtask = objSanitizer.EncryptResponseData(sessionTask, configurations);
                            if (!String.IsNullOrEmpty(encryptedSelectedtask) && !encryptedSelectedtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedSelectedtask;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region EditSessionTask
        /// <summary>
        /// 2228166 - EDIT Session TASK
        /// </summary>
        /// <param name="editsession"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> EditSesssionTask([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] SessionTaskIn sessiontask,
            int? mileStoneId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            mileStoneId = decryptedqsEncValue["mileStoneId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            SessionTask sessionTask = new SessionTask();
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?mileStoneId=" + mileStoneId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(edittask);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.EditSessionTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        sessionTask = JsonConvert.DeserializeObject<SessionTask>(result);
                        if (sessionTask != null)
                        {
                            string encryptedSelectedtask = objSanitizer.EncryptResponseData(sessionTask, configurations);
                            if (!String.IsNullOrEmpty(encryptedSelectedtask) && !encryptedSelectedtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedSelectedtask;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region DeleteSessionTask
        /// <summary>
        /// 2228166 - DELETE SESSION TASK
        /// </summary>
        /// <param name="SESSIONTaskId"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> DeleteSessionTask(string qsEncValue)
        {
            int? sessionTaskId;
            string loginId;
            int? activeStatus;
            int? isManagerTask;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            sessionTaskId = decrypted["sessionTaskId"];
            isManagerTask = decrypted["isManagerTask"];
            loginId = objSanitizer.InputSanitizer(loginId);
            activeStatus = decrypted["activeStatus"];
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string queryString = "?sessionTaskId=" + sessionTaskId + "&" + "isManagerTask=" + isManagerTask + "&"
                + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId) + "&"
                + "activeStatus=" + activeStatus;
            HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.DeleteSessionTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedresult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedresult) && !encryptedresult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedresult;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region AddInductionContent
        /// <summary>
        /// 298148 - ADD INDUCTION CONTENT
        /// </summary>
        /// <param name="contentIn"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> AddInductionContent([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] InductionContentIn contentIn
            string loginId;

            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<InductionContentIn> indContent = new List<InductionContentIn>();
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(contentIn);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.AddInductionContent + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        indContent = JsonConvert.DeserializeObject<List<InductionContentIn>>(result);
                        if (indContent != null)
                        {
                            string encryptedIndContent = objSanitizer.EncryptResponseData(indContent, configurations);
                            if (!String.IsNullOrEmpty(encryptedIndContent) && !encryptedIndContent.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedIndContent;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region EditInductionContent
        /// <summary>
        /// 298148 - EDIT INDUCTION CONTENT
        /// </summary>
        /// <param name="contentIn"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> EditInductionContent([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] InductionContentIn contentIn;
            string loginId;

            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<InductionContentIn> indContent = new List<InductionContentIn>();
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(contentIn);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.EditInductionContent + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        indContent = JsonConvert.DeserializeObject<List<InductionContentIn>>(result);
                        if (indContent != null)
                        {
                            string encryptedIndContent = objSanitizer.EncryptResponseData(indContent, configurations);
                            if (!String.IsNullOrEmpty(encryptedIndContent) && !encryptedIndContent.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedIndContent;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region DeleteInductionContent
        /// <summary>
        /// 298148 - DELETE INDUCTION CONTENT
        /// </summary>
        /// <param name="IndContentId"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> DeleteInductionContent(string qsEncValue)
        {
            //Original Params
            int IndContentId;
            string loginId;

            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            IndContentId = decrypted["IndContentId"];
            //loginId = "280826";
            //planId = 3;
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string queryString = "?IndContentId=" + IndContentId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
            HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.DeleteInductionContent + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedresult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedresult) && !encryptedresult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedresult;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region AddManagerSelectedTask
        /// <summary>
        /// 298148 - ADD MANAGER SELECTED TASK
        /// </summary>
        /// <param name="task"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> AddManagerSelectedTask([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] SelectedTaskIn task;
            int planId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            planId = decryptedqsEncValue["planId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            SelectedTask selectedtask = new SelectedTask();
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(task);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.AddManagerSelectedTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        selectedtask = JsonConvert.DeserializeObject<SelectedTask>(result);
                        if (selectedtask != null)
                        {
                            string encryptedSelectedtask = objSanitizer.EncryptResponseData(selectedtask, configurations);
                            if (!String.IsNullOrEmpty(encryptedSelectedtask) && !encryptedSelectedtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedSelectedtask;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region EditManagerSelectedTask
        /// <summary>
        /// 298148 - EDIT MANAGER SELECTED TASK
        /// </summary>
        /// <param name="task"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> EditManagerSelectedTask([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original params
            //[FromBody] SelectedTaskIn task;
            int? planId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            planId = decryptedqsEncValue["planId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            SelectedTask selectedtask = new SelectedTask();
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(task);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.EditManagerSelectedTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        selectedtask = JsonConvert.DeserializeObject<SelectedTask>(result);
                        if (selectedtask != null)
                        {
                            string encryptedSelectedtask = objSanitizer.EncryptResponseData(selectedtask, configurations);
                            if (!String.IsNullOrEmpty(encryptedSelectedtask) && !encryptedSelectedtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedSelectedtask;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region AddManagerCustomTask
        /// <summary>
        /// 298148 - ADD MANAGER CUSTOM TASK
        /// </summary>
        /// <param name="task"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> AddManagerCustomTask([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //original params
            //[FromBody] CustomTaskIn task;
            int planId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            planId = decryptedqsEncValue["planId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            CustomTask ctask = new CustomTask();
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(task);
                    //var jsonval = JsonConvert.SerializeObject(task);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.AddManagerCustomTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        ctask = JsonConvert.DeserializeObject<CustomTask>(result);
                        if (ctask != null)
                        {
                            string encryptedCtask = objSanitizer.EncryptResponseData(ctask, configurations);
                            if (!String.IsNullOrEmpty(encryptedCtask) && !encryptedCtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedCtask;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region EditManagerCustomTask
        /// <summary>
        /// 298148 - EDIT MANAGER CUSTOM TASK
        /// </summary>
        /// <param name="task"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> EditManagerCustomTask([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            //[FromBody] CustomTaskIn task
            int planId;
            string loginId;
            EncryptValues qsEncVal = new EncryptValues();
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            planId = decryptedqsEncValue["planId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            CustomTask ctask = new CustomTask();
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<NewJoinersList> filteredData = new List<NewJoinersList>();
                    string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(task);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.EditManagerCustomTask + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        ctask = JsonConvert.DeserializeObject<CustomTask>(result);
                        if (ctask != null)
                        {
                            string encryptedCtask = objSanitizer.EncryptResponseData(ctask, configurations);
                            if (!String.IsNullOrEmpty(encryptedCtask) && !encryptedCtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedCtask;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetAssignPlan
        /// <summary>
        /// 298148 - GET ASSIGNE PLAN
        /// </summary>
        /// <param name="planId"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetAssignPlan(string qsEncValue)
        {
            //Original query params
            //int? planId;
            string planId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            planId = decrypted["planId"];
            //planId = (decrypted["planId"] == "") ? 0 : Convert.ToInt32(decrypted["planId"]);
            loginId = decrypted["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            planId = objSanitizer.InputSanitizer(planId);
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    AssignPlan apPlan = new AssignPlan();
                    string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.GetAssignPlan + queryString);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        apPlan = JsonConvert.DeserializeObject<AssignPlan>(result);
                        if (apPlan != null)
                        {
                            string encryptedapPlan = objSanitizer.EncryptResponseData(apPlan, configurations);
                            if (!String.IsNullOrEmpty(encryptedapPlan) && !encryptedapPlan.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedapPlan;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetMSTaskDetails
        /// <summary>
        /// 298148 - GET MS TASK DETAILS
        /// </summary>
        /// <param name="planId"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<EncryptValues>> GetMSTaskDetails(string qsEncValue)
        {
            //Original Params
            string planId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            planId = decrypted["planId"];
            loginId = decrypted["loginId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            planId = objSanitizer.InputSanitizer(planId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<MSDetails> apPlan = new List<MSDetails>();
                    string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.GetMSTaskDetails + queryString);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        apPlan = JsonConvert.DeserializeObject<List<MSDetails>>(result);
                        if (apPlan != null)
                        {
                            string encryptedMatserList = objSanitizer.EncryptResponseData(apPlan, configurations);
                            if (!String.IsNullOrEmpty(encryptedMatserList) && !encryptedMatserList.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedMatserList;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetInductionContent
        /// <summary>
        /// 298148 - GET INDUCTION CONTENT
        /// </summary>
        /// <param name="planId"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetInductionContent(string qsEncValue)
        {
            //Original query params
            int planId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            planId = decrypted["planId"];
            loginId = decrypted["loginId"];
            //planId = 3; //for testing
            //loginId = "280826";  //for testing
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<InductionContentIn> apPlan = new List<InductionContentIn>();
                    string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.GetInductionContent + queryString);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        apPlan = JsonConvert.DeserializeObject<List<InductionContentIn>>(result);
                        if (apPlan != null)
                        {
                            string encryptedMatserList = objSanitizer.EncryptResponseData(apPlan, configurations);
                            if (!String.IsNullOrEmpty(encryptedMatserList) && !encryptedMatserList.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedMatserList;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetManagerTaskDetails
        /// <summary>
        /// 298148 - GET MANAGER TASK DETAILS
        /// </summary>
        /// <param name="planId"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetManagerTaskDetails(string qsEncValue)
        {
            //Original params
            int planId;
            string loginId;
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            planId = decrypted["planId"];
            //loginId = "280826";
            //planId = 3;
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<ManagerTaskDetails> mTask = new List<ManagerTaskDetails>();
                    string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.GetManagerTaskDetails + queryString);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        mTask = JsonConvert.DeserializeObject<List<ManagerTaskDetails>>(result);
                        if (result != null)
                        {
                            string encryptedresult = objSanitizer.EncryptResponseData(mTask, configurations);
                            if (!String.IsNullOrEmpty(encryptedresult) && !encryptedresult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedresult;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region SaveAssignPlan
        /// <summary>
        /// 298148 - SAVE ASSIGN PLAN
        /// </summary>
        /// <param name="planId"></param>
        /// <param name="assignPlanIn"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> SaveAssignPlan([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original Params
            string planId;
            //[FromBody] AssignPlanIn assignPlanIn;
            string loginId;
            EncryptValues qsEncVal = new EncryptValues();
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            planId = decryptedqsEncValue["planId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);

                    //var jsonval = JsonConvert.SerializeObject(assignPlanIn);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.SaveAssignPlan + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedresult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedresult) && !encryptedresult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedresult;
                                return env;

                                //EncryptValues env = new EncryptValues();
                                //env.Error = "Line No:2452 - planId -" + planId  + "decryptedfbEncValue=" + decryptedfbEncValue + ":jsonval" + jsonval + "result" + result;
                                //return env;

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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region PublishPlan
        /// <summary>
        /// 298148 - PUBLISH PLAN
        /// </summary>
        /// <param name="planId"></param>
        /// <param name="effectiveDate"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> PublishPlan(string qsEncValue)
        {
            //Original Params
            int planId;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            planId = decrypted["planId"];
            //loginId = "280826";
            //planId = 3; //for testing 
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                Regex regex = new Regex("^[0-9]+$");
                if (regex.IsMatch(loginId))
                {
                    if (!string.IsNullOrEmpty(loginId) && planId >= 0)
                    {
                        string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                        string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);

                        HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");

                        using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                        {
                            client.BaseAddress = new Uri(apibaseURL);

                            HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.PublishPlan + queryString, content);

                            if (response != null && response.IsSuccessStatusCode)
                            {
                                var result = response.Content.ReadAsStringAsync().Result;
                                if (result != null)
                                {
                                    string encryptedresult = objSanitizer.EncryptResponseData(result, configurations);
                                    if (!String.IsNullOrEmpty(encryptedresult) && !encryptedresult.Contains("Encryption Error"))
                                    {
                                        EncryptValues env = new EncryptValues();
                                        env.EncryptedValue = encryptedresult;
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
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region CopyPlan
        /// <summary>
        /// 298148 - COPY PLAN
        /// </summary>
        /// <param name="planId"></param>
        /// <param name="loginId"></param>
        /// <returns>NewPlanId</returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> CopyPlan(string qsEncValue)
        {
            //Original params
            int planId;
            string loginId;
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            planId = decrypted["planId"];
            //loginId = "280826";
            //planId = 3;
            loginId = objSanitizer.InputSanitizer(loginId);
            string queryString = "?planId=" + planId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.CopyPlan + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedresult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedresult) && !encryptedresult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedresult;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
		#endregion


		#region SaveUploadedTaskStatus 
		/// <summary>
		/// 2219158 - SAVE UPLOADED TASK STATUS
		/// </summary>
		/// <param name="EmployeeId"></param>
		/// <param name="TaskName"></param>
		/// <param name="TaskStatus"></param>
		/// <returns></returns>
		[HttpPost]
		[ValidateHeaderAntiForgeryToken]
		public async Task<ActionResult<EncryptValues>> SaveUploadedTaskStatus([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
		{
			string loginId;
			InputSanitization objSanitizer = new InputSanitization();
			dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
			dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
			loginId = decryptedqsEncValue["loginId"];
			loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //string SessionLoginId = HttpContext.Session.GetString("LoginId");
            //string SessionRoleType = HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
			{
				string apibaseURL = configurations.GetValue<string>("APIBaseURL");
				using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
				{
					string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);

					//var jsonval = JsonConvert.SerializeObject(corpInds);
					var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);

					var content = new StringContent(jsonval, System.Text.Encoding.UTF8, "application/json");
					HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.SaveTaskUploadedStatus + queryString, content);

					if (response != null && response.IsSuccessStatusCode)
					{
						var result = response.Content.ReadAsStringAsync().Result;
						result = JsonConvert.SerializeObject(result);

						if (result != null)
						{
							string encryptedMileStones = objSanitizer.EncryptResponseData(result, configurations);
							if (!String.IsNullOrEmpty(encryptedMileStones) && !encryptedMileStones.Contains("Encryption Error"))
							{
								EncryptValues env = new EncryptValues();
								env.EncryptedValue = encryptedMileStones;
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
			else
			{
				return new UnauthorizedResult();
			}
		}
		#endregion


		#region SaveAttendance 
		/// <summary>
		/// 2219158 - SAVE ATTENDANCE DETAILS
		/// </summary>
		/// <param name="EmployeeId"></param>
		/// <param name="Attendance Status"></param>
		/// <param name="Date"></param>
		/// <param name="FacilitatorId"></param>
		/// <returns></returns>
		[HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> SaveAttendanceDetails([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);

                    //var jsonval = JsonConvert.SerializeObject(corpInds);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);

                    var content = new StringContent(jsonval, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.SaveAttendanceDetails + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        result = JsonConvert.SerializeObject(result);

                        if (result != null)
                        {
                            string encryptedMileStones = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedMileStones) && !encryptedMileStones.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedMileStones;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region SaveAssignedPOC
        /// <summary>
        /// Ranjith - 554448
        /// </summary>
        /// <param name="encValue"></param>
        /// <param name="qsEncValue"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> SaveAssignedPOC([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            string loginId;
            string assignToAdminId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            assignToAdminId = decryptedqsEncValue["adminId"];
            assignToAdminId = objSanitizer.InputSanitizer(assignToAdminId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");

                //string apibaseURL = "https://localhost:7146/CognizantOn/";
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    //string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);

                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId) + "&" + "assignToAdminId=" + Microsoft.Security.Application.Encoder.HtmlEncode(assignToAdminId);

                    //var jsonval = JsonConvert.SerializeObject(corpInds);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);

                    var content = new StringContent(jsonval, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.SaveAssignedPOC + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        result = JsonConvert.SerializeObject(result);

                        if (result != null)
                        {
                            string assignedPOCNames = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(assignedPOCNames) && !assignedPOCNames.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = assignedPOCNames;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region SaveOtherAssignedPOC
        /// <summary>
        /// Ranjith - 554448
        /// </summary>
        /// <param name="encValue"></param>
        /// <param name="qsEncValue"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> SaveOtherAssignedPOC([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            string loginId;
            string assignToAdminId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            assignToAdminId = decryptedqsEncValue["adminId"];
            assignToAdminId = objSanitizer.InputSanitizer(assignToAdminId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    //string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);

                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId) + "&" + "assignToAdminId=" + Microsoft.Security.Application.Encoder.HtmlEncode(assignToAdminId);

                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);

                    var content = new StringContent(jsonval, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.SaveAssignedPOC + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        result = JsonConvert.SerializeObject(result);

                        if (result != null)
                        {
                            string assignedPOCNames = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(assignedPOCNames) && !assignedPOCNames.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = assignedPOCNames;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetAdminList
        /// <summary>
        /// 298148 - GET ADMIN USER LIST
        /// </summary>
        /// <returns>Master Data List</returns>
        [HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetAdminList(string qsEncValue)
        {
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("Role");
            if (SessionRoleType == "Admin" || SessionRoleType == "Super Admin")
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<RoleList> adminList = new List<RoleList>();
                    string queryString = "?loginId=" + loginId;
                    HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.GetAdminList + queryString, content);
                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        adminList = JsonConvert.DeserializeObject<List<RoleList>>(result);
                        if (adminList != null)
                        {
                            string encryptedadminList = objSanitizer.EncryptResponseData(adminList, configurations);
                            if (!String.IsNullOrEmpty(encryptedadminList) || encryptedadminList.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedadminList;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetAdminIdName
        /// <summary>
        /// 298148 - GET ADMIN ID AND NAME
        /// </summary>
        /// <param name="encValue"></param>
        /// <param name="qsEncValue"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetAdminIdName([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original query params
            string loginId;
            EncryptValues encVal = new EncryptValues();
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<AdminResult> adminIdName = new List<AdminResult>();
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(filterList);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.GetAdminIdName + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        adminIdName = JsonConvert.DeserializeObject<List<AdminResult>>(result);
                        if (adminIdName != null)
                        {
                            string encryptedMatserList = objSanitizer.EncryptResponseData(adminIdName, configurations);
                            if (!String.IsNullOrEmpty(encryptedMatserList) && !encryptedMatserList.Contains("Encryption Error"))
                            {
                                encVal.EncryptedValue = encryptedMatserList;
                                return encVal;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region SaveAdminRoleDetails
        /// <summary>
        /// 298148 - SAVE ADMIN DETAILS
        /// </summary>
        /// <param name="encValue"></param>
        /// <param name="qsEncValue"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> SaveAdminRoleDetails([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            //Original query params
            string loginId;
            EncryptValues encVal = new EncryptValues();
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<AdminResult> adminresult = new List<AdminResult>();
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    //var jsonval = JsonConvert.SerializeObject(filterList);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.SaveAdminRoleDetails + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        adminresult = JsonConvert.DeserializeObject<List<AdminResult>>(result);
                        if (adminresult != null)
                        {
                            string encryptedMatserList = objSanitizer.EncryptResponseData(adminresult, configurations);
                            if (!String.IsNullOrEmpty(encryptedMatserList) && !encryptedMatserList.Contains("Encryption Error"))
                            {
                                encVal.EncryptedValue = encryptedMatserList;
                                return encVal;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region DeleteAdminRoleDetails
        /// <summary>
        /// 298148 - DELETE ADMIN ID DETAILS
        /// </summary>
        /// <param name="qsEncValue"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> DeleteAdminRoleDetails(string qsEncValue)
        {
            string associateID;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            associateID = decrypted["associateID"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string queryString = "?associateID=" + associateID + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
            HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.DeleteAdminRoleDetails + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedResult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedResult) && !encryptedResult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedResult;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region UpdateAdminRoleDetails
        /// <summary>
        /// 298148 - UPDATE ROLE FOR ADMIN AND SUPER ADMIN
        /// </summary>
        /// <param name="qsEncValue"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> UpdateAdminRoleDetails(string qsEncValue)
        {
            string associateID;
            string role;
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            associateID = decrypted["associateID"];
            role = decrypted["role"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string queryString = "?associateID=" + associateID + "&" + "role=" + role + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
            HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.UpdateAdminRoleDetails + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedResult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedResult) && !encryptedResult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedResult;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region GetAssociateKeyDocuments
        /// <summary>
        /// 2228166 - GET Associate Key Document LIST
        /// </summary>
        /// <returns>associate Key Document List</returns>
        [HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> GetAssociateKeyDocuments(string qsEncValue)
        {
            string loginId;
            InputSanitization objinpsanitize = new InputSanitization();
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("Role");
            if (SessionRoleType == "Super Admin")
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<AssociateKeyDocuments> associateKeyDocuments = new List<AssociateKeyDocuments>();
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
                    HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.GetAssociateKeyDocuments + queryString);
                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        associateKeyDocuments = JsonConvert.DeserializeObject<List<AssociateKeyDocuments>>(result);
                        if (associateKeyDocuments != null)
                        {
                            string encryptedassociateKeyDocuments = objinpsanitize.EncryptResponseData(associateKeyDocuments, configurations);
                            if (!String.IsNullOrEmpty(encryptedassociateKeyDocuments) || encryptedassociateKeyDocuments.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedassociateKeyDocuments;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region DeleteKeyDocuments
        /// <summary>
        /// 2228166 - DELETE Key Documents
        /// </summary>
        /// <param name="OCMContentId"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> DeleteKeyDocuments(string qsEncValue)
        {
            //Original Params
            string OCMContentId;
            string loginId;

            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decrypted["loginId"];
            OCMContentId = decrypted["ocmContentId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");
            string queryString = "?OCMContentId=" + OCMContentId + "&" + "loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);
            HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.DeleteAssociateKeyDocuments + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedresult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedresult) && !encryptedresult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedresult;
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
            else
            {
                return new UnauthorizedResult();
            }

        }
        #endregion

        #region UploadAssociateKeyDocuments
        /// <summary>
        /// 2228166 - Upload Associate Key document in OCM
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> UploadAssociateKeyDocuments([FromBody] FormbodyEncryptedValue encValue)
        {
            //Original Params
            string loginId;
            EncryptValues qsEncVal = new EncryptValues();
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            loginId = decryptedfbEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("OCMAPIBaseURL");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    List<OCMUploadResponse> oCMUploadResponses = new List<OCMUploadResponse>();
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);
                    var content = new StringContent(jsonval, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.UploadAssociateKeyDocuments, content);
                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        oCMUploadResponses = JsonConvert.DeserializeObject<List<OCMUploadResponse>>(result);
                        if (oCMUploadResponses != null)
                        {
                            string encryptedCtask = objSanitizer.EncryptResponseData(oCMUploadResponses, configurations);
                            if (!String.IsNullOrEmpty(encryptedCtask) && !encryptedCtask.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedCtask;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
		#endregion

        #region DownloadAssociateKeyDocuments
        /// <summary>
        /// 2228166 - Download Associate Key Document
        /// </summary>
        /// <returns>associate Key Document List</returns>
        [HttpGet]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> DownloadAssociateKeyDocuments(string qsEncValue)
        {
            string ocmContentId;
            string loginId;
            string associateId;
            InputSanitization objinpsanitize = new InputSanitization();
            string apibaseURL = configurations.GetValue<string>("OCMAPIBaseURL");
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            ocmContentId = decrypted["ocmContentId"];
            loginId = decrypted["loginId"];
            associateId = decrypted["associateId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            associateId = objSanitizer.InputSanitizer(associateId);
            ocmContentId = objSanitizer.InputSanitizer(ocmContentId);
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Super Admin" || SessionRoleType == "Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    OCMFileDownloadResponse oCMFileDownloadResponse = new OCMFileDownloadResponse();
                    string queryString = "?ocmContentId=" + ocmContentId + "&loginId=" + loginId + "&associateId=" + associateId;
                    HttpResponseMessage response = await client.GetAsync(apibaseURL + AppConstants.DownloadAssociateKeyDocuments + queryString);
                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        oCMFileDownloadResponse = JsonConvert.DeserializeObject<OCMFileDownloadResponse>(result);
                        if (oCMFileDownloadResponse != null)
                        {
                            string encryptedassociateKeyDocuments = objinpsanitize.EncryptResponseData(oCMFileDownloadResponse, configurations);
                            if (!String.IsNullOrEmpty(encryptedassociateKeyDocuments) || encryptedassociateKeyDocuments.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedassociateKeyDocuments;
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
            else
            {
                return new BadRequestResult();
            }

		}
		#endregion 
        
        #region ReAssignPlanonButtonClick
		/// <summary>
		/// 298148 - RE ASSIGN PLAN BY SUPER ADMIN
		/// </summary>
		/// <param name="qsEncValue"></param>
		/// <returns></returns>
		[HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> ReAssignPlanonButtonClick([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            string newJoinerID;
            string planAssigned;
            string loginId;
            EncryptValues encVal = new EncryptValues();
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decrypted = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            newJoinerID = decrypted["newJoinerID"];
            planAssigned = decryptedfbEncValue;
            loginId = decrypted["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string apibaseURL = configurations.GetValue<string>("APIBaseURL");

            string queryString = "?newJoinerID=" + Convert.ToString(newJoinerID) + "&" + "planAssigned=" + Convert.ToString(Microsoft.Security.Application.Encoder.HtmlEncode(planAssigned)) + "&" + "loginId=" + Convert.ToString(Microsoft.Security.Application.Encoder.HtmlEncode(loginId));
            HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.ReAssignPlanonButtonClick + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        if (result != null)
                        {
                            string encryptedResult = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedResult) && !encryptedResult.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedResult;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region SaveAttendance 
        /// <summary>
        /// 2219158 - SAVE ATTENDANCE DETAILS
        /// </summary>
        /// <param name="EmployeeId"></param>
        /// <param name="Assign to Admin></param>
        /// <param name="Date"></param>
        /// <param name="FacilitatorId"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> AssigntoAdminDetails([FromBody] FormbodyEncryptedValue encValue, string qsEncValue)
        {
            string loginId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedfbEncValue = objSanitizer.DecryptRequestData(encValue.FbEncValue, configurations);
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            loginId = decryptedqsEncValue["loginId"];
            loginId = objSanitizer.InputSanitizer(loginId);
            string SessionLoginId = distributedCacheService.GetUserCacheAsync<string>(loginId, "LoginId", HttpContext).GetAwaiter().GetResult();
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(loginId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("LoginId");
            //HttpContext.Session.GetString("Role");
            if (SessionLoginId == loginId && (SessionRoleType == "Admin" || SessionRoleType == "Super Admin"))
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");

                //string apibaseURL = "https://localhost:7146/CognizantOn/";
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?loginId=" + Microsoft.Security.Application.Encoder.HtmlEncode(loginId);

                    //var jsonval = JsonConvert.SerializeObject(corpInds);
                    var jsonval = JsonConvert.SerializeObject(decryptedfbEncValue);

                    var content = new StringContent(jsonval, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.AssignAdminDetails + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        result = JsonConvert.SerializeObject(result);

                        if (result != null)
                        {
                            string encryptedMileStones = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedMileStones) && !encryptedMileStones.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedMileStones;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region UpdateCompletionStatus 
        /// <summary>
        /// 2228166 - Update Associate Task Completion status
        /// </summary>
        /// <param name="taskId">task Id</param>
        /// <param name="taskName">task Name </param>
        /// <param name="associateId">associate Id</param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> UpdateAssociateCompletionStatus(string qsEncValue)
        {
            string taskId;
            string taskName;
            string associateId;
            InputSanitization objSanitizer = new InputSanitization();
            dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            associateId = decryptedqsEncValue["associateId"];
            taskName = decryptedqsEncValue["taskName"];
            taskId = decryptedqsEncValue["taskId"];
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(associateId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("Role");
            if (SessionRoleType == "Admin" || SessionRoleType == "Super Admin")
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");

                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?taskId=" + taskId + "&" + "taskName=" + taskName + "&" + "associateId=" + associateId;
                    HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.UpdateAssociateCompletionStatus + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        result = JsonConvert.SerializeObject(result);

                        if (result != null)
                        {
                            string encryptedMileStones = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedMileStones) && !encryptedMileStones.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedMileStones;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

        #region UpdateDownloadDocStatus 
        /// <summary>
        /// 2228166 - Update Download document status
        /// </summary>
        /// <param name="taskId">task Id</param>
        /// <param name="taskName">task Name </param>
        /// <param name="associateId">associate Id</param>
        /// <returns></returns>
        [HttpPost]
        [ValidateHeaderAntiForgeryToken]
        public async Task<ActionResult<EncryptValues>> UpdateDownloadDocStatus(string qsEncValue)
        {
            int taskId;
            string ocmContentId;
            string associateId;
            InputSanitization objSanitizer = new InputSanitization();
			dynamic decryptedqsEncValue = objSanitizer.DecryptRequestData(qsEncValue, configurations);
            associateId = decryptedqsEncValue["associateId"];
            ocmContentId = decryptedqsEncValue["ocmContentId"];
            taskId = decryptedqsEncValue["taskId"];
            string SessionRoleType = distributedCacheService.GetUserCacheAsync<string>(associateId, "Role", HttpContext).GetAwaiter().GetResult();
            //HttpContext.Session.GetString("Role");
            if (SessionRoleType == "Admin" || SessionRoleType == "Super Admin")
            {
                string apibaseURL = configurations.GetValue<string>("APIBaseURL");

                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?taskId=" + taskId + "&" + "ocmContentId=" + ocmContentId + "&" + "associateId=" + associateId;
                    HttpContent content = new StringContent(queryString, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(apibaseURL + AppConstants.UpdateDownloadDocStatus + queryString, content);

                    if (response != null && response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsStringAsync().Result;
                        result = JsonConvert.SerializeObject(result);

                        if (result != null)
                        {
                            string encryptedMileStones = objSanitizer.EncryptResponseData(result, configurations);
                            if (!String.IsNullOrEmpty(encryptedMileStones) && !encryptedMileStones.Contains("Encryption Error"))
                            {
                                EncryptValues env = new EncryptValues();
                                env.EncryptedValue = encryptedMileStones;
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
            else
            {
                return new UnauthorizedResult();
            }
        }
        #endregion

    }
}
