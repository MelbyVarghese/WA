//-----------------------------------------------------------------------
// <copyright file="DurationDetailsMaster.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Duration Details Master
    /// </summary>
    [Serializable]
    public class DurationDetailsMaster
    {
        /// <summary>
        /// Get or sets Duration Master List
        /// </summary>
        public List<DurationMaster> durationMasterList { get; set; }

        /// <summary>
        /// Get or sets Duration call
        /// </summary>
        public List<DurationCalMaster> durationCalMasterList { get; set; }

    }

    /// <summary>
    /// Duration Master Class
    /// </summary>
    public class DurationMaster
    {
        /// <summary>
        /// Get or sets Duration ID
        /// </summary>
        public int DurationId { get; set; }

        /// <summary>
        /// Get or sets Duration Desc
        /// </summary>
        public string DurationDesc { get; set; }
    }

    /// <summary>
    /// Duration Call Master
    /// </summary>
    public class DurationCalMaster
    {
        /// <summary>
        /// Get or sets Duration Call Id
        /// </summary>
        public int DurationCalId { get; set; }

        /// <summary>
        /// Duration call Desc
        /// </summary>
        public string DurationCalDesc { get; set; }
    }

    /// <summary>
    /// Duration Details class
    /// </summary>
    public class DurationDetails
    {
        /// <summary>
        /// Get or sets Duration ID
        /// </summary>
        public int DurationId { get; set; }

        /// <summary>
        /// Get or sets Duration Desc
        /// </summary>
        public string DurationDesc { get; set; }

        /// <summary>
        /// Get or sets Duration Call Id
        /// </summary>
        public int DurationCalId { get; set; }

        /// <summary>
        /// Get or sets Duration Call Desc
        /// </summary>
        public string DurationCalDesc { get; set; }

        /// <summary>
        /// Get or sets Duration Call Map
        /// </summary>
        public int DurationCalMapId { get; set; }
    }
}
