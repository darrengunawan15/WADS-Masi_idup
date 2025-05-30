const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    ticket: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Ticket',
    },
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment; 