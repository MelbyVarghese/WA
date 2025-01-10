// //-----------------------------------------------------------------------
// // <copyright file="ExceptionDetails.cs" company="Cognizant">
// //     Copyright (c) Cognizant. All rights reserved.
// // </copyright>
// //
// // Developed By : Monica
// // Developer ID : 547827
// //-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models.BaseModels
{
    /// <summary>
    /// Exception Details Class
    /// </summary>
    public class ExceptionDetails
    {
        /// <summary>
        /// Gets or sets the associate id.
        /// </summary>
        public string? AssociateId { get; set; }

        /// <summary>
        /// Gets or sets the error source.
        /// </summary>
        public string? ErrorSource { get; set; }

        /// <summary>
        /// Gets or sets the exception date time.
        /// </summary>
        public string? ExceptionDateTime { get; set; }

        /// <summary>
        /// Gets or sets the exception message.
        /// </summary>
        public string? ExceptionMessage { get; set; }

        /// <summary>
        /// Gets or sets the exception stack trace.
        /// </summary>
        public string? ExceptionStackTrace { get; set; }

        /// <summary>
        /// Gets or sets the inner exception.
        /// </summary>
        public string? InnerException { get; set; }
    }
}
