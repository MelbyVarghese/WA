//-----------------------------------------------------------------------
// <copyright file="Master.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Master Class
    /// </summary>
    [Serializable]
    public class Master
    {
        /// <summary>
        /// Get or sets Grade Master List
        /// </summary>
        public List<GradeMaster> Grades { get; set; }

        /// <summary>
        /// Get or sets Service Line Master List
        /// </summary>
        public List<ServiceLineMaster> ServiceLines { get; set; }

        /// <summary>
        /// Get or sets Vertical Master List
        /// </summary>
        public List<VerticalMaster> Verticals { get; set; }


        /// <summary>
        /// Get or sets Country Master List
        /// </summary>
        public List<CountryMaster> Countries { get; set; }

        /// <summary>
        /// Get or sets City Master List
        /// </summary>
        public List<CityMaster> Cities { get; set; }


        /// <summary>
        /// Gets or sets Ageing Master
        /// </summary>
        public List<AgeingMaster> Ageing { get; set; }

    }

    /// <summary>
    /// Grade Master Class
    /// </summary>
    public class GradeMaster
    {
        /// <summary>
        /// Get or Sets Grade ID
        /// </summary>
        public string GradeId { get; set; }

        /// <summary>
        /// Get or sets Grade Code
        /// </summary>
        public string? GradeCode { get; set; }

        /// <summary>
        /// Get or sets Grade Desc
        /// </summary>
        public string? GradeDesc { get; set; }
    }

    /// <summary>
    /// Service Line Master Class
    /// </summary>
    public class ServiceLineMaster
    {
        /// <summary>
        /// Get or Sets ServiceLine Id
        /// </summary>
        public string ServiceLineId { get; set; }

        /// <summary>
        /// Get or sets Service Line Code
        /// </summary>
        public string? ServiceLineCode { get; set; }

        /// <summary>
        /// Get or sets Service Line Desc
        /// </summary>
        public string? ServiceLineDesc { get; set; }
    }

    /// <summary>
    /// Country Master Class
    /// </summary>
    public class CountryMaster
    {
        /// <summary>
        /// Get or Sets Country Id
        /// </summary>
        public string CountryId { get; set; }

        /// <summary>
        /// Get or sets Country Code
        /// </summary>
        public string? CountryCode { get; set; }

        /// <summary>
        /// Get or sets Country Desc
        /// </summary>
        public string? CountryDesc { get; set; }
    }

    /// <summary>
    /// City Master class
    /// </summary>
    public class CityMaster
    {
        /// <summary>
        /// Get or Sets PK City ID
        /// </summary>
        public string CityId { get; set; }

        /// <summary>
        /// Get or sets City Code
        /// </summary>
        public string? CityCode { get; set; }

        /// <summary>
        /// Get or sets City Desc
        /// </summary>
        public string? CityDesc { get; set; }
    }

    /// <summary>
    /// Ageing Master class
    /// </summary>
    public class AgeingMaster
    {
        /// <summary>
        /// Get or sets Day Id
        /// </summary>
        public int DayId { get; set; }

        /// <summary>
        /// Get or Sets Days
        /// </summary>
        public string? Days { get; set; }
    }

    /// <summary>
    /// Vertical Master Class
    /// </summary>
    public class VerticalMaster
    {
        /// <summary>
        /// Get or Sets Vertical Id
        /// </summary>
        public string VerticalId { get; set; }

        /// <summary>
        /// Get or sets Service Line Code
        /// </summary>
        public string? VerticalCode { get; set; }

        /// <summary>
        /// Get or sets Service Line Desc
        /// </summary>
        public string? VerticalDesc { get; set; }
    }
}
