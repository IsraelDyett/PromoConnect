const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupChatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  members:[{
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  messages: [{
    timestamp: { type: Date, default: Date.now },
    message: {
    type: String,
    required: true
    },
    sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
  }],
});

const Groupchat = mongoose.model('Groupchat', groupChatSchema);

module.exports = Groupchat;