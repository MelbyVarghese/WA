//-----------------------------------------------------------------------
// <copyright file="SelectedTaskIn.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models.InputModel
{
    /// <summary>
    /// Selected Task Input Parameter
    /// </summary>
    [Serializable]
    public class SelectedTaskIn
    {
        /// <summary>
        /// Gets or Sets Selected Task Id
        /// </summary>
        public int SelectedTaskId { get; set; }

        /// <summary>
        /// Gets or Sets Task Id
        /// </summary>
        public int TaskId { get; set; }

        /// <summary>
        /// Gets or Sets Task Description
        /// </summary>
        public string? TaskDescription { get; set; }

        /// <summary>
        /// Gets or Sets Image Url
        /// </summary>
        public string? ImageUrl { get; set; }

        /// <summary>
        /// Gets or Sets Reminder Schedule
        /// </summary
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
