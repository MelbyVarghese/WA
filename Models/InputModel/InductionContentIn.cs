//-----------------------------------------------------------------------
// <copyright file="InductionContentIn.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models.InputModel
{
    /// <summary>
    /// Induction Content Input Class
    /// </summary>
    [Serializable]
    public class InductionContentIn
    {
        /// <summary>
        /// Get or sets Content ID
        /// </summary>
        public int IndContentId { get; set; }

        /// <summary>
        /// Get or sets Plan ID
        /// </summary>
        public int PlanId { get; set; }

        /// <summary>
        /// Get or sets Title
        /// </summary>
        public string? Title { get; set; }

        /// <summary>
        /// Get or sets Description
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Get or sets Uploaded File
        /// </summary>
        public string? UploadedFile { get; set; }

        /// <summary>
        /// Get or sets Link
        /// </summary>
        public string? Link { get; set; }

        /// <summary>
        /// Get or sets Image URL
        /// </summary>
        public string? ImageUrl { get; set; }

    }
}
