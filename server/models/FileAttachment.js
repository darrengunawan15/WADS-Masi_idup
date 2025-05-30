const mongoose = require('mongoose');

const fileAttachmentSchema = mongoose.Schema(
  {
    ticket: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Ticket',
    },
    link: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const FileAttachment = mongoose.model('FileAttachment', fileAttachmentSchema);

module.exports = FileAttachment; 