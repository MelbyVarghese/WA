//-----------------------------------------------------------------------
// <copyright file="MSTaskDetails.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    [Serializable]
    public class MSTaskDetails
    {
        /// <summary>
        /// Gets or Sets MS Id
        /// </summary>
        public int MSId { get; set; }

        /// <summary>
        /// Gets or Sets MS Name
        /// </summary>
        public string? MSName { get; set; }

        /// <summary>
        /// Gets or Sets Duration Id
        /// </summary>
        public int DurationId { get; set; }

        /// <summary>
        /// Gets or Sets Duration Desc
        /// </summary>
        public string? DurationDesc { get; set; }

        /// <summary>
        /// Gets or Sets DurationCal Id
        /// </summary>
        public int DurationCalId { get; set; }

        /// <summary>
        /// Gets or Sets DurationCal Desc
        /// </summary>
        public string? DurationCalDesc { get; set; }

        /// <summary>
        /// Gets or Sets Task Name
        /// </summary>
        public string? TaskName { get; set; }

        /// <summary>
        /// Gets or Sets Task Desc
        /// </summary>
        public string? TaskDesc { get; set; }

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
    }
}
