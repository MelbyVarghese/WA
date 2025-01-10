//-----------------------------------------------------------------------
// <copyright file="AssignPlan.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using CognizantOn_Admin.Models.InputModel;
using System.Diagnostics.Metrics;

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Assign Plan Class
    /// </summary>
    public class AssignPlan
    {
        /// <summary>
        /// Gets or sets List of Grade Master
        /// </summary>
        public List<GradeMaster> Grades { get; set; }

        /// <summary>
        /// Gets or sets List of ServiceLine Master
        /// </summary>
        public List<ServiceLineMaster> ServiceLines { get; set; }

        /// <summary>
        /// Gets or sets List of Country master
        /// </summary>
        public List<CountryMaster> Countries { get; set; }

        /// <summary>
        /// Gets or sets List of City Master
        /// </summary>
        public List<CityMaster> Cities { get; set; }

        /// <summary>
        /// Gets or sets List of Assign Plans
        /// </summary>
        public List<AssignPlanIn> AssignPlans { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public DateTime EffectiveDate { get; set; }

        /// <summary>
        /// Gets or Sets 
        /// </summary>
        public int APDetailsMapId { get; set; }
    }
}
