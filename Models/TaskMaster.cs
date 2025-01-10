//-----------------------------------------------------------------------
// <copyright file="TaskMaster.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Task Master List
    /// </summary>
    [Serializable]
    public class TaskMaster
    {
        /// <summary>
        /// Get or sets task master Id
        /// </summary>
        public int PKTaskMasterId { get; set; }

        /// <summary>
        /// Get or sets Task name
        /// </summary>
        public string? TaskName { get; set; }

        /// <summary>
        /// Get or sets task Description
        /// </summary>
        public string? TaskDescription { get; set; }

        /// <summary>
        /// Get or sets image Url
        /// </summary>
        public string? ImageUrl { get; set; }

        /// <summary>
        /// Get or sets Redirection Link
        /// </summary>
        public string? RedirectionLink { get; set; }

        /// <summary>
        /// Get or sets PK Reminder ID
        /// </summary>
        public int ReminderSchedule { get; set; }

        /// <summary>
        /// Get or sets Desc
        /// </summary>
        public string? ReminderDescription { get; set; }

        /// <summary>
        /// Get or sets Repeat ID
        /// </summary>
        public int RepeatSchedule { get; set; }

        /// <summary>
        /// Get or sets Description
        /// </summary>
        public string? RepeatDescription { get; set; }

        /// <summary>
        /// Get or sets Is Mark Complete Enabled
        /// </summary>
        public bool IsMarkCompleteEnabled { get; set; }

    }
}
