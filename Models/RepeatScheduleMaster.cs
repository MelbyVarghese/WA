//-----------------------------------------------------------------------
// <copyright file="RepeatScheduleMaster.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Repeat Schedul Master Class
    /// </summary>
    [Serializable]
    public class RepeatScheduleMaster
    {
        /// <summary>
        /// Get or sets Repeat ID
        /// </summary>
        public int PKRepeatId { get; set; }

        /// <summary>
        /// Get or sets Description
        /// </summary>
        public string? Description { get; set; }
    }
}
