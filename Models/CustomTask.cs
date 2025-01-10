namespace CognizantOn_Admin.Models
{
    public class CustomTask : TaskMaster
    {
        /// <summary>
        /// Get or sets Custom TaskId
        /// </summary>
        public int CustomTaskId { get; set; }

        /// <summary>
        /// Get or sets Reminder Schedule
        /// </summary>
        public int ReminderSchedule { get; set; }

        /// <summary>
        /// Get or sets Repeat Schedule
        /// </summary>
        public int RepeatSchedule { get; set; }

        /// <summary>
        /// Get or sets Mark Completed
        /// </summary>
        public bool MarkCompleted { get; set; }

        /// <summary>
        /// Get or sets MS Id
        /// </summary>
        public int MSId { get; set; }

        /// <summary>
        /// Get or sets Active Status
        /// </summary>
        public bool ActiveStatus { get; set; }
    }
}
