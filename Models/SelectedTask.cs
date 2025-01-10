//-----------------------------------------------------------------------
// <copyright file="SelectedTask.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Selected Task Class
    /// </summary>
    [Serializable]
    public class SelectedTask : TaskMaster
    {
        /// <summary>
        /// Get or sets Selected Task
        /// </summary>
        public int SelectedTaskId { get; set; }

        /// <summary>
        /// Get or sets Reminder schedule
        /// </summary>
        public int ReminderSchedule { get; set; }

        /// <summary>
        /// Get or sets Repeat schedule
        /// </summary>
        public int RepeatSchedule { get; set; }

        /// <summary>
        /// Get or sets Mark completed
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
