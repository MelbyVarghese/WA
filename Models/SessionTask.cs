namespace CognizantOn_Admin.Models
{
    public class SessionTask
    {
        /// <summary>
        /// Get or sets Session Task
        /// </summary>
        public int SessionTaskId { get; set; }

        /// <summary>
        /// Get or sets mark completed
        /// </summary>
        public bool MarkCompleted { get; set; }

        /// <summary>
        /// Get or sets MS ID
        /// </summary>
        public int MSId { get; set; }

        /// <summary>
        /// Get or sets Active Status
        /// </summary>
        public bool ActiveStatus { get; set; }
    }
}
