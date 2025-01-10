// //-----------------------------------------------------------------------
// // <copyright file="UntypedDataset.cs" company="Cognizant">
// //     Copyright (c) Cognizant. All rights reserved.
// // </copyright>
// //-----------------------------------------------------------------------

namespace CognizantOn_Admin.Helpers
{
    using System.Data;
    using System.Runtime.Serialization;

    /// <summary>
    /// TypedDataset is used as alternative of data set
    /// </summary>
    [Serializable]
    [System.ComponentModel.DesignerCategory("Code")]
    public class UntypedDataset : DataSet
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="UntypedDataset"/> typed Dataset class.
        /// </summary>
        public UntypedDataset()
            : base()
        {
        }

        /// <summary>
        /// Constructor class
        /// Initializes a new instance of the <see cref="UntypedDataset"/> class.
        /// </summary>
        /// <param name="info">info parameter</param>
        /// <param name="context">context parameter</param>
        protected UntypedDataset(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}
