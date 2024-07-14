const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for applications
const applicationSchema = new Schema({
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
  },
  documents: [{
    name: {
      type: String,
      required: true
    },
    file: {
      type: String, // URL or path to the file
      required: true
    }
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
