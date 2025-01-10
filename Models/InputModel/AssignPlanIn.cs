//-----------------------------------------------------------------------
// <copyright file="AssignPlanIn.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models.InputModel
{
    /// <summary>
    /// Assign Plan In Class
    /// </summary>
    [Serializable]
    public class AssignPlanIn
    {
        /// <summary>
        /// Gets or Sets 
        /// </summary>
        public int APDetailsMapId { get; set; }

        /// <summary>
        /// Gets or Sets EffectiveDate
        /// </summary>
        public DateTime EffectiveDate { get; set; }

        /// <summary>
        /// Gets or Sets GradeIds
        /// </summary>
        public string? GradeIds { get; set; }

        /// <summary>
        /// Gets or Sets ServiceLineIds
        /// </summary>
        public string? ServiceLineIds { get; set; }

        /// <summary>
        /// Gets or Sets CountryIds
        /// </summary>
        public string? CountryIds { get; set; }

        /// <summary>
        /// Gets or Sets CityIds
        /// </summary>
        public string? CityIds { get; set; }

    }
}
