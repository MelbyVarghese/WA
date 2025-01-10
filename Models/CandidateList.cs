//-----------------------------------------------------------------------
// <copyright file="CandidateList.cs" company="CTS A360">
//     Copyright (c) . All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    [Serializable]
    public class CandidateList
    {
        /// <summary>
        /// Get or set Candidate ID
        /// </summary>
        public string CandidateId { get; set; }

        /// <summary>
        /// Get or set Associate Name
        /// </summary>
        public string AssociateName { get; set; }

        /// <summary>
        /// Get or set Grade
        /// </summary>
        public string Grade { get; set; }

        /// <summary>
        /// Get or set Service Line
        /// </summary>
        public string ServiceLine { get; set; }

        /// <summary>
        /// Get or set City
        /// </summary>
        public string City { get; set; }

        /// <summary>
        /// Get or set Country
        /// </summary>
        public string Country { get; set; }

        /// <summary>
        /// Get or set Date Of Joining
        /// </summary>
        public string DateOfJoining { get; set; }
    }
}
