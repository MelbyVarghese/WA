
using StackExchange.Redis;
using System.Text.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace CognizantOn_Admin.Helper
{
    /// <summary>
    /// DistributedCache Services class
    /// </summary>
    public class DistributedCacheService
    {

           public DistributedCacheService()
            {
            }
        #region Private Members
        /// <summary>  
        /// Redis Connection Multiplexer  
        /// </summary>  
        private readonly ConnectionMultiplexer _connection;

        /// <summary>  
        /// Redis Cache Database  
        /// </summary>  
        private readonly IDatabase _cache;

        /// <summary>  
        /// Cache Expiration TimeSpan  
        /// </summary>  
        private readonly TimeSpan _cacheExpiration;

        /// <summary>  
        /// Cache Expiration TimeSpan  
        /// </summary>  
        private readonly string cacheUserSession;
        /// <summary>  
        /// isRedisCacheSession  
        /// </summary>  
        private readonly bool isRedisCacheSession;
        #endregion


        /// <summary>
        /// Configuration Interface
        /// </summary>
        private IConfiguration configurations;

        #region Constructor
        /// <summary>
        /// Initializes a new instance of the DistributedCacheService class
        /// </summary>
        /// <param name="configuration">configuration</param>
        public DistributedCacheService(IConfiguration iconfig)
        {
            configurations = iconfig;
            string connectionString = configurations.GetValue<string>("AzureRedisCacheConnection");
            //!string.IsNullOrEmpty(ConfigurationHelper.config.GetValue<string>(OneC_428_Core_Common.Constant.Constants.AzureRedisCacheConnection)) ? ConfigurationHelper.config.GetValue<string>(OneC_428_Core_Common.Constant.Constants.AzureRedisCacheConnection) : "";
            this.cacheUserSession = configurations.GetValue<string>("CognizantOn_User_Session");
            int cacheExpireValue =  !string.IsNullOrEmpty(configurations.GetValue<string>("CognizantOn_User_Session_Expiry")) ? Convert.ToInt32(configurations.GetValue<string>("CognizantOn_User_Session_Expiry")) : 60;
            isRedisCacheSession = !string.IsNullOrEmpty(configurations.GetValue<string>("CognizantOn_IsRedisCacheSession")) ? Convert.ToBoolean(configurations.GetValue<string>("CognizantOn_IsRedisCacheSession")) : true;

            // Initialize Redis connection and cache        
            _connection = ConnectionMultiplexer.Connect(connectionString);
            _cache = _connection.GetDatabase();
            _cacheExpiration = TimeSpan.FromMinutes(cacheExpireValue);
        }
        #endregion

        #region public methods
        #region Method to Set user-specific cache
        /// <summary>
        /// Method to Set user-specific cache
        /// </summary>
        /// <param name="userId">userId</param>
        /// <param name="dataType">dataType</param>
        /// <param name="data">data</param>
        /// <returns></returns>

        public async Task SetUserCacheAsync(string userId, string dataType, object data, HttpContext httpContext)
        {
            string cacheKey = $"{this.cacheUserSession}:{userId}";
            try
            {
                var jsonData = JsonSerializer.Serialize(data, new JsonSerializerOptions() { IncludeFields = true });
                if (isRedisCacheSession)
                {
                    await _cache.HashSetAsync(cacheKey, new HashEntry[]
                        {
                new HashEntry(dataType, jsonData)
                        });
                    await _cache.KeyExpireAsync(cacheKey, _cacheExpiration);
                }
                else
                {
                    httpContext.Session.SetString(dataType, jsonData);
                }
                //this.dashboardServices.SaveAuditLog("SetUserCacheAsync"+cacheKey, " SetUserCacheAsync", userId, "SetUserCache", "Success");
            }
            catch (Exception ex)
            {
                // Log the exception and return an appropriate error response
                throw ex;
            }
        }
        #endregion

        #region Method to Get user-specific cache

        /// <summary>
        /// Method to Get user-specific cache
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="userId"></param>
        /// <param name="dataType"></param>
        /// <returns></returns>
        public async Task<T> GetUserCacheAsync<T>(string userId, string dataType, HttpContext httpContext)
        {
            string cacheKey = $"{this.cacheUserSession}:{userId}";
            var result = string.Empty;
            try
            {
                var jsonData = await _cache.HashGetAllAsync(cacheKey);

                if (isRedisCacheSession)
                {
                    if (jsonData.Length == 0)
                    {
                        return default(T);
                    }
                    await _cache.KeyExpireAsync(cacheKey, _cacheExpiration);
                    var resultArray = jsonData.ToDictionary(entry => entry.Name.ToString(), entry => entry.Value.ToString());
                    result = jsonData.Where(k => k.Name == dataType).Select(k => k.Value.ToString()).SingleOrDefault();
                }
                else
                {
                    result = httpContext.Session.GetString(dataType);
                }
                //this.dashboardServices.SaveAuditLog("SetUserCacheAsync"+cacheKey, " SetUserCacheAsync", userId, "SetUserCache", "Success");
                return result != null && result != "" ? JsonSerializer.Deserialize<T>(result) : default(T);
            }
            catch (Exception ex)
            {
                // Log the exception and return an appropriate error response
                return default(T);
            }
        }
        #endregion

    }
    #endregion
}
