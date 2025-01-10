//-----------------------------------------------------------------------
// <copyright file="NewJoinersList.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// New Joiner List
    /// </summary>
    [Serializable]
    public class NewJoinersList
    {
        /// <summary>
        /// Get or sets candidate Id
        /// </summary>
        public string? CandidateId { get; set; }

        /// <summary>
        /// Get or sets Employee ID
        /// </summary>
        public string? EmployeeId { get; set; }

        /// <summary>
        /// Get or sets Associate Name
        /// </summary>
        public string? AssociateName { get; set; }

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
        /// Get or sets date of joining
        /// </summary>
        public DateTime? DateOfJoining { get; set; }

        /// <summary>
        /// Get or sets date of joining
        /// </summary>
        public string? monthofjoining { get; set; }

        /// <summary>
        /// Get or sets Assigned Plan
        /// </summary>
        public string? AssignedPlan { get; set; }

        /// <summary>
        /// Get or sets Remaining
        /// </summary>
        public int Remaining { get; set; }

        /// <summary>
        /// Get or sets Ageing
        /// </summary>
        public int Ageing { get; set; }

        /// <summary>
        /// Get or sets Ongoing Milestones
        /// </summary>
        public string? OngoingMilestones { get; set; }

        /// <summary>
        /// Get or sets Corp Unduction flag
        /// </summary>
        public string IsCorpInduction { get; set; }

        /// <summary>
        /// Get or sets Vertical
        /// </summary>
        public string? Vertical { get; set; }

        /// <summary>
        /// Get or sets Induction Date
        /// </summary>
        public string? InductionDate { get; set; }

        /// <summary>
        /// Get or sets Project Name
        /// </summary>
        public string? ProjectName { get; set; }

        /// <summary>
        /// Get or sets Account Name
        /// </summary>
        public string? AccountName { get; set; }

        /// <summary>
        /// Get or sets Welcome Mail Status
        /// </summary>
        public string? WelcomeMailStatus { get; set; }

        /// <summary>
        /// Get or sets Facilitator Id
        /// </summary>
        public string? FacilitatorId { get; set; }

        /// <summary>
        /// Get or sets Manager Connect Status
        /// </summary>
        public string? ManagerConnectStatus { get; set; }

        /// <summary>
        /// Get or sets Manager Connect Status
        /// </summary>
        public string? HireType { get; set; }

        /// <summary>
        /// Get or sets Admin PoC Type
        /// </summary>
        public string? AdminPoC { get; set; }


        /// <summary>
        /// Get or sets Admin PoC Name Type
        /// </summary>
        public string? AdminPoCName { get; set; }

    }
}
