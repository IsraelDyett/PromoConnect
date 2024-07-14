const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'Event'],
    required: true
  },
  media: {
    type: String, // URL to the image or video
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
