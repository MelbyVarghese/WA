//-----------------------------------------------------------------------
// <copyright file="MileStone.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Mile stone class
    /// </summary>
    [Serializable]
    public class MileStone
    {
        /// <summary>
        /// Get or sets MS ID
        /// </summary>
        public int MSId { get; set; }

        /// <summary>
        /// Get or sets MS Name
        /// </summary>
        public string MSName { get; set; }

        /// <summary>
        /// Get or sets Greeting text
        /// </summary>
        public string GreetingText { get; set; }

        /// <summary>
        /// Get or sets Duration
        /// </summary>
        public int DurationId { get; set; }

        /// <summary>
        /// Get or sets Duration Call
        /// </summary>
        public int DurationCalId { get; set; }

        /// <summary>
        /// Get or sets AP ID
        /// </summary>
        public int PlanId { get; set; }

    }
}
