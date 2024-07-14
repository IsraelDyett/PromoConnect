const mongoose = require('mongoose');
const Post = require('./Post');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  timeAndDate: {
    type: Date,
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  requirements: {
    type: String
  },
  whatsappGroupLink: {
    type: String,
    required: false
  },
  Links:  [{
    name: {
      type: String,
    },
    link: {
      type: String,
    }
  }]
}, { discriminatorKey: 'type' });

const Event = Post.discriminator('Event', eventSchema, { discriminatorKey: 'type' });


module.exports = Event;
