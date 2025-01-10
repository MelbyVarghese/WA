using CognizantOn_Admin.Models.BaseModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace CognizantOn_Admin.Models
{
    public class InputSanitization
    {
        /// <summary>
        /// Configuration Interface
        /// </summary>
        private IConfiguration configurations;

        /// <summary>
        /// Configuration - Appsetting json 
        /// </summary>
        /// <param name="iconfig"></param>
        public InputSanitization(IConfiguration iconfig)
        {
            configurations = iconfig;
        }

        public InputSanitization()
        {
            configurations = new ConfigurationBuilder().Build();
        }

        public string InputSanitizer(string input)
        {
            string pattern = "[^a-zA-Z0-9]";
            string sanitizedinput = Regex.Replace(input, pattern, "");
            return sanitizedinput;
        }

        public string EncryptResponseData(object respObj, IConfiguration respconfig)
        {
            try
            {
                string encryptedKey = "";
                ExceptionDetails exceptionDetails = new ExceptionDetails();
                string ClientIdkey = respconfig.GetValue<string>("ClientIdkey");
                string ClientIdIV = respconfig.GetValue<string>("ClientIdIV");
                if(respObj is string)
                {
                     encryptedKey = encryptstring(respObj.ToString(), ClientIdkey, ClientIdIV);
                }
                else
                {
                     encryptedKey = Encrypt(respObj, ClientIdkey, ClientIdIV);
                }
                string finalQueryString = string.Empty;
                finalQueryString = encryptedKey;
                return finalQueryString;
            }
            catch (SystemException ex)
            {
                return "Encryption Error" + ex.ToString();
            }
        }
        public string Encrypt(object responseObjIn, string keyText, string ivText)
        {
            string responseObj = string.Empty;
            var jsonSerializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            if (responseObjIn is IEnumerable && !(responseObjIn is string))
            {
                var interimObject = JsonConvert.DeserializeObject<List<ExpandoObject>>(Newtonsoft.Json.JsonConvert.SerializeObject(responseObjIn));
                responseObj = JsonConvert.SerializeObject(interimObject, jsonSerializerSettings);
            }
            else
            {
                var interimObject = JsonConvert.DeserializeObject<ExpandoObject>(Newtonsoft.Json.JsonConvert.SerializeObject(responseObjIn));
                responseObj = JsonConvert.SerializeObject(interimObject, jsonSerializerSettings);
            }
            string jsonstring = responseObj;
            byte[] iv = new System.Text.UTF8Encoding().GetBytes(ivText);
            //byte[] iv = new byte[16];
            byte[] array;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(keyText);
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(jsonstring);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(array);
        }


        public string encryptstring(string responseObjIn, string keyText, string ivText)
        {
            //string responseObj = string.Empty;
            string jsonstring = responseObjIn;
            byte[] iv = new System.Text.UTF8Encoding().GetBytes(ivText);
            //byte[] iv = new byte[16];
            byte[] array;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(keyText);
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(jsonstring);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(array);
        }

        public dynamic DecryptRequestData(string reqData, IConfiguration respconfig)
        {
            try
            {
                ExceptionDetails exceptionDetails = new ExceptionDetails();
                string ClientIdkey = respconfig.GetValue<string>("ClientIdkey");
                string ClientIdIV = respconfig.GetValue<string>("ClientIdIV");
                string decryptedJSONString = Decrypt(reqData, ClientIdkey, ClientIdIV);
                //string finalQueryString = string.Empty;
                dynamic finalQueryString = Newtonsoft.Json.JsonConvert.DeserializeObject(decryptedJSONString);
                return finalQueryString;
            }
            catch (SystemException ex)
            {
                return "Decryption Error" + ex.ToString();
            }
        }
        public string Decrypt(string reqData, string keyText, string ivText)
        {
            byte[] iv = new System.Text.UTF8Encoding().GetBytes(ivText);

            string paddedreqData = Fixbase64string(reqData);
            byte[] buffer = Convert.FromBase64String(paddedreqData);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(keyText);
                aes.IV = iv;
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream(buffer))
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader((Stream)cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }


        public string Fixbase64string(string cipherText)
        {
            try
            {
                string filteredstring = new string(cipherText.Where(c => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".Contains(c)).ToArray());

                if (filteredstring.Length == 1 && filteredstring.Contains("0"))
                {
                    filteredstring += '=';

                }
                else
                {
                    while (filteredstring.Length % 4 != 0)
                    {
                        filteredstring += '=';
                    }
                }

                byte[] decodedData = Convert.FromBase64String(filteredstring);
                return filteredstring;
            }

            catch (Exception ex)
            {
                return null;

            }
        }

    }
}
