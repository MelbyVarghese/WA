//-----------------------------------------------------------------------
// <copyright file="LoginResponse.cs" company="Cognizant">
//     Copyright (c) Cognizant. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace CognizantOn_Admin.Models
{
    /// <summary>
    /// Login Response
    /// </summary>
    [Serializable]
    public class LoginResponse
    {
        /// <summary>
        /// Gets or Sets Active Status
        /// </summary>
        public string ActiveStatus { get; set; }

        /// <summary>
        /// Gets or Sets Is Proxy Enabled
        /// </summary>
        public string IsProxyEnabled { get; set; }

        /// <summary>
        /// Gets or Sets Role Type
        /// </summary>
        public string RoleType { get; set; }

        /// <summary>
        /// Gets or Sets Associate ID
        /// </summary>
        public string AssociateID { get; set; }

        /// <summary>
        /// Gets or Sets Country
        /// </summary>
        public string Country { get; set; }
    }
}
