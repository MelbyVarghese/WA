//-----------------------------------------------------------------------
// <copyright file="APTemplate.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Assimilation template Class
    /// </summary>
    [Serializable]
    public class APTemplate
    {
        /// <summary>
        /// Get or sets Plan ID
        /// </summary>
        public int PlanId { get; set; }

        /// <summary>
        /// Get or sets Plan Title
        /// </summary>
        public string PlanTitle { get; set; }

        /// <summary>
        /// Get or sets Plan Description
        /// </summary>
        public string PlanDescription { get; set; }

        /// <summary>
        /// Get or sets Plan Effective date
        /// </summary>
        public DateTime PlanEffDate { get; set; }

        /// <summary>
        /// Get or sets Default
        /// </summary>
        public bool IsDefault { get; set; }

        /// <summary>
        /// Get or sets Draft
        /// </summary>
        public bool IsDraft { get; set; }

        /// <summary>
        /// Get or sets Tag
        /// </summary>
        public string Tag { get; set; }
    }
}
