//-----------------------------------------------------------------------
// <copyright file="TaskMasterDetails.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Task Master Details Classs
    /// </summary>
    [Serializable]
    public class TaskMasterDetails
    {
        /// <summary>
        /// Get or sets Task Master List
        /// </summary>
        public List<TaskMaster> taskMasters { get; set; }

        /// <summary>
        /// Get or sets Reminder Schedule Master List
        /// </summary>
        public List<ReminderScheduleMaster> reminderScheduleMasters { get; set; }

        /// <summary>
        /// Get or sets Repeat Schedule Master List
        /// </summary>
        public List<RepeatScheduleMaster> repeatScheduleMasters { get; set; }

        /// <summary>
        /// Get or sets Grade list
        /// </summary>
        public List<GradeMaster> gradeMasters { get; set; }
    }
}
