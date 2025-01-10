//-----------------------------------------------------------------------
// <copyright file="CustomTaskIn.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models.InputModels
{
    /// <summary>
    /// Custom Task In Class
    /// </summary>
    [Serializable]
    public class CustomTaskIn
    {
        /// <summary>
        /// Gets or Sets Custom Task Id
        /// </summary>
        public int CustomTaskId { get; set; }

        /// <summary>
        /// Gets or Sets Task Name
        /// </summary>
        public string? TaskName { get; set; }

        /// <summary>
        /// Gets or Sets Task Description
        /// </summary>
        public string? TaskDescription { get; set; }

        /// <summary>
        /// Gets or Sets Image Url
        /// </summary>
        public string? ImageUrl { get; set; }

        /// <summary>
        /// Gets or Sets Redirection Link
        /// </summary>
        public string? RedirectionLink { get; set; }

        /// <summary>
        /// Gets or Sets Reminder Schedule
        /// </summary>
        public int ReminderSchedule { get; set; }

        /// <summary>
        /// Gets or Sets Repeat Schedule
        /// </summary>
        public int RepeatSchedule { get; set; }

        /// <summary>
        /// Gets or Sets Mark Completed
        /// </summary>
        public bool MarkCompleted { get; set; }


        /// <summary>
        /// Gets or Sets GradeIds
        /// </summary>
        public string? GradeIds { get; set; }

        /// <summary>
        /// Get or sets Active Status
        /// </summary>
        public bool ActiveStatus { get; set; }
    }
}
