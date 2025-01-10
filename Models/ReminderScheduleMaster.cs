//-----------------------------------------------------------------------
// <copyright file="ReminderScheduleMaster.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Reminder Schedule Master
    /// </summary>
    [Serializable]
    public class ReminderScheduleMaster
    {
        /// <summary>
        /// Get or sets Reminder ID
        /// </summary>
        public int PKReminderId { get; set; }

        /// <summary>
        /// Get or sets Description
        /// </summary>
        public string? Description { get; set; }
    }
}
