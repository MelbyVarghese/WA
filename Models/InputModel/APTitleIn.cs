//-----------------------------------------------------------------------
// <copyright file="APTitleIn.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models.InputModels
{
    /// <summary>
    /// Assimilation Plan Title
    /// </summary>
    [Serializable]
    public class APTitleIn
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
    }
}
