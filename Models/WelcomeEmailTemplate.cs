// //-----------------------------------------------------------------------
// // <copyright file="AssociateAssimilationProgress.cs" company="Cognizant">
// //     Copyright (c) Cognizant. All rights reserved.
// // </copyright>
// //
// // Developed By : 547827(Monica)
// //-----------------------------------------------------------------------
namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Welcome Email Class
    /// </summary>
    [Serializable]
    public class WelcomeEmailTemplate
    {
        /// <summary>
        /// Gets or set Template ID
        /// </summary>
        public int TemplateID { get; set; }

        /// <summary>
        /// Get or sets Subject
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// Get or Sets Message
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Get or sets Contact email
        /// </summary>
        public string SupportContactEmail { get; set; }

        /// <summary>
        /// Get or sets Plan Id
        /// </summary>
        public int PlanId { get; set; }

    }
}
