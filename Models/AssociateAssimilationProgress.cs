// //-----------------------------------------------------------------------
// // <copyright file="AssociateAssimilationProgress.cs" company="Cognizant">
// //     Copyright (c) Cognizant. All rights reserved.
// // </copyright>
// //
// // Developed By : 298148(Gauri)
// //-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Associate Assimilation Details
    /// </summary>
    [Serializable]
    public class AssociateAssimilationProgress
    {
        /// <summary>
        /// Associate Details
        /// </summary>
        public List<AssociateDetails> AssociateDetails { get; set; }

        /// <summary>
        /// Associate Milestones
        /// </summary>
        public List<MSDetails> Milestones { get; set; }

        /// <summary>
        /// Manager Response
        /// </summary>
        public List<Feedback> Feedback { get; set; }

    }

    /// <summary>
    /// Associate Details Class
    /// </summary>
    public class AssociateDetails
    {
        /// <summary>
        /// Get or sets Empl ID
        /// </summary>
        public string? EmplID { get; set; }

        /// <summary>
        /// Get or sets Associate Name
        /// </summary>
        public string? AssociateName { get; set; }

        /// <summary>
        /// Get or sets Email id
        /// </summary>
        public string? EmailId { get; set; }

        /// <summary>
        /// Get or sets Grade Code
        /// </summary>
        public string? GradeCode { get; set; }

        /// <summary>
        /// Gets or sets Grade Desc
        /// </summary>
        public string? GradeDesc { get; set; }

        /// <summary>
        /// Get or sets ServiceLine Code
        /// </summary>
        public string? ServiceLineCode { get; set; }

        /// <summary>
        /// Get or sets ServiceLine Desc
        /// </summary>
        public string? ServiceLineDesc { get; set; }

        /// <summary>
        /// Get or sets City Code
        /// </summary>
        public string? CityCode { get; set; }

        /// <summary>
        /// Get or sets City Desc
        /// </summary>
        public string? CityDesc { get; set; }

        /// <summary>
        /// Get or sets Date of Joining
        /// </summary>
        public DateTime DateofJoining { get; set; }

        /// <summary>
        /// Get or sets HM Id
        /// </summary>
        public string? HMId { get; set; }

        /// <summary>
        /// Get or sets HM Name
        /// </summary>
        public string? HMName { get; set; }

        /// <summary>
        /// Get or sets HM MailId
        /// </summary>
        public string? HMMailId { get; set; }

        /// <summary>
        /// Get or sets HM Grade Code
        /// </summary>
        public string? HMGradeCode { get; set; }

        /// <summary>
        /// Get or sets HM Grade Desc
        /// </summary>
        public string? HMGradeDesc { get; set; }

        /// <summary>
        /// Get or sets HM ServiceLineCode
        /// </summary>
        public string? HMServiceLineCode { get; set; }

        /// <summary>
        /// Get or sets HM ServiceLineDesc
        /// </summary>
        public string? HMServiceLineDesc { get; set; }
    }

    public class MSDetails
    {
        public Milestones mileStones { get; set; }
        public List<TaskDetails> taskDetails { get; set; }
    }

    public class TaskDetails
    {
        /// <summary>
        /// Gets or Sets MS Id
        /// </summary>
        public int MSId { get; set; }

        /// <summary>
        /// Gets or Sets Task Id
        /// </summary>
        public int TaskId { get; set; }

        /// <summary>
        /// Gets or Sets Task Name
        /// </summary>
        public string? TaskName { get; set; }

        /// <summary>
        /// Gets or Sets Task Desc
        /// </summary>
        public string? TaskDesc { get; set; }

        /// <summary>
        /// Gets or Sets Selected Task Id
        /// </summary>
        public int SelectedTaskId { get; set; }

        /// <summary>
        /// Gets or Sets Reminder Id
        /// </summary>
        public int ReminderId { get; set; }

        /// <summary>
        /// Gets or Sets Reminder Desc
        /// </summary>
        public string? ReminderDesc { get; set; }

        /// <summary>
        /// Gets or Sets Repeat Id
        /// </summary>
        public int RepeatId { get; set; }

        /// <summary>
        /// Gets or Sets  Repeat Desc
        /// </summary>
        public string? RepeatDesc { get; set; }

        /// <summary>
        /// Gets or Sets Image Url
        /// </summary>
        public string? ImageUrl { get; set; }

        /// <summary>
        /// Gets or Sets Status
        /// </summary>
        public string? Status { get; set; }

        /// <summary>
        /// Gets or Sets Redirection Link
        /// </summary>
        public string? RedirectionLink { get; set; }

        /// <summary>
        /// Get or sets Mark enabled
        /// </summary>
        public int IsMarkEnabled { get; set; }

        /// <summary>
        /// Get or sets Active Status
        /// </summary>
        public int ActiveStatus { get; set; }

        /// <summary>
        /// Gets or Sets GradeIds
        /// </summary>
        public string? GradeIds { get; set; }

        /// <summary>
        /// Gets or sets List of Grade Master
        /// </summary>
        public List<GradeMaster> Grades { get; set; }

        /// <summary>
        /// Get or sets Document Upload/Download Task flag
        /// </summary>
        public int IsDocUploadDownloadTask { get; set; }

		/// <summary>
		/// Get or sets All Document Downloaded flag
		/// </summary>
		public int IsAllDocDownloaded { get; set; }

		/// <summary>
		/// Get or sets Task Documents
		/// </summary>
		public List<TaskDocument> TaskDocuments { get; set; }

    }

    /// <summary>
    /// Task Document Class
    /// </summary>
    public class TaskDocument
    {
        /// <summary>
        /// Gets or Sets Task Id
        /// </summary>
        public int TaskId { get; set; }

        /// <summary>
        /// Gets or Sets Task Name
        /// </summary>
        public string? TaskName { get; set; }
        /// <summary>
        /// Gets or Sets Document Id
        /// </summary>
        public string OCMContentID { get; set; }

        /// <summary>
        /// Gets or Sets Document Name
        /// </summary>
        public string DocName { get; set; }

    }

    /// <summary>
    /// Milestones Class
    /// </summary>
    public class Milestones
    {
        /// <summary>
        /// Gets or Sets MS Id
        /// </summary>
        public int MSId { get; set; }

        /// <summary>
        /// Gets or Sets MS Name
        /// </summary>
        public string? MSName { get; set; }

        /// <summary>
        /// Gets or Sets Duration Id
        /// </summary>
        public int DurationId { get; set; }

        /// <summary>
        /// Gets or Sets Duration Desc
        /// </summary>
        public string? DurationDesc { get; set; }

        /// <summary>
        /// Gets or Sets DurationCal Id
        /// </summary>
        public int DurationCalId { get; set; }

        /// <summary>
        /// Gets or Sets DurationCal Desc
        /// </summary>
        public string? DurationCalDesc { get; set; }

        /// <summary>
        /// Gets or Sets Start Day
        /// </summary>
        public int StartDay { get; set; }

        /// <summary>
        /// Gets or Sets End Day
        /// </summary>
        public int EndDay { get; set; }

        /// <summary>
        /// Gets or Sets Start Date
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Gets or Sets End Date
        /// </summary>
        public DateTime EndDate { get; set; }

        /// <summary>
        /// Gets or Sets Greeting Text
        /// </summary>
        public string? GreetingText { get; set; }
    }

    /// <summary>
    /// Feedback Class
    /// </summary>
    public class Feedback
    {
        /// <summary>
        /// Get or sets Manager Response 
        /// </summary>
        public string? ManagerResponse { get; set; }

        /// <summary>
        /// Get or sets Manager task status
        /// </summary>
        public string ManagerTaskStatus { get; set; }
    }
}
