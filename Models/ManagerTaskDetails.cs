//-----------------------------------------------------------------------
// <copyright file="ManagerTaskDetails.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Manager Task Details
    /// </summary>
    [Serializable]
    public class ManagerTaskDetails
    {

        /// <summary>
        /// Gets or Sets MS Id
        /// </summary>
        public int PlanId { get; set; }

        /// <summary>
        /// Gets or Sets Task Id
        /// </summary>
        public int TaskId { get; set; }

        /// <summary>
        /// Gets or Sets Task Name
        /// </summary>
        public string? TaskName { get; set; }

        /// <summary>
        /// Gets or Sets Task Desc
        /// </summary>
        public string? TaskDesc { get; set; }

        /// <summary>
        /// Gets or Sets Selected Task Id
        /// </summary>
        public int SelectedTaskId { get; set; }

        /// <summary>
        /// Gets or Sets Reminder Id
        /// </summary>
        public int ReminderId { get; set; }

        /// <summary>
        /// Gets or Sets Reminder Desc
        /// </summary>
        public string? ReminderDesc { get; set; }

        /// <summary>
        /// Gets or Sets Repeat Id
        /// </summary>
        public int RepeatId { get; set; }

        /// <summary>
        /// Gets or Sets  Repeat Desc
        /// </summary>
        public string? RepeatDesc { get; set; }

        public string? Image { get; set; }

        /// <summary>
        /// Gets or Sets Status
        /// </summary>
        public string? Status { get; set; }

        /// <summary>
        /// Gets or Sets Is AssCompleted Enabled
        /// </summary>
        public bool IsAssCompletedEnabled { get; set; }

        /// <summary>
        /// Gets or Sets Redirection Link
        /// </summary>
        public string? RedirectionLink { get; set; }

        /// <summary>
        /// Get or sets Active Status
        /// </summary>
        public bool Activestatus { get; set; }
    }
}
