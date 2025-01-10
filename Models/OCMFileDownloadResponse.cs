namespace CognizantOn_Admin.Models
{
    public class OCMFileDownloadResponse
    {
        public string ErrorMessage { get; set; }
        /// <summary>
        /// File content in byte array
        /// </summary>
        public byte[] FileDataBase64 { get; set; }
        /// <summary>
        /// File Name
        /// </summary>
        public string FileName { get; set; }
    }
}
