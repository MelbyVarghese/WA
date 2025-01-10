namespace CognizantOn_Admin.Models
{
    public class TokenResponse
    {
        public string TokenValue { get; set; }

        public string Session_Key { get; set; }

        public bool IsPTEnv { get; set; }
        public string ProxyUserId { get; set; }

    }


    public class EncryptKeys
    {
        public string EdInfo { get; set; }
    }
}
