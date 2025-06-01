const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['unassigned', 'in progress', 'resolved'],
      default: 'unassigned',
    },
    customer: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
    fileAttachments: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'FileAttachment',
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket; 