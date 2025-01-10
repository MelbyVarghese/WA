//-----------------------------------------------------------------------
// <copyright file="FilterList.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models.InputModel
{
    [Serializable]
    public class FilterList
    {
        /// <summary>
        /// Get or sets grade
        /// </summary>
        public string? Grade { get; set; }

        /// <summary>
        /// Get or sets Service line
        /// </summary>
        public string? ServiceLine { get; set; }

        /// <summary>
        /// Get or sets City
        /// </summary>
        public string? City { get; set; }

        /// <summary>
        /// Get or sets Country
        /// </summary>
        public string? Country { get; set; }

        /// <summary>
        /// Get or sets Ageing
        /// </summary>
        public string? Ageing { get; set; }

        /// <summary>
        /// Get or sets From Date
        /// </summary>
        public string? FromDate { get; set; }

        /// <summary>
        /// Get or sets To Date
        /// </summary>
        public string? ToDate { get; set; }

        /// <summary>
        /// Get or sets Vertical
        /// </summary>
        public string? Vertical { get; set; }
    }
}
