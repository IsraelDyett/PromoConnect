const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['admin', 'Ambassador', 'company'],
    default: 'user',
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: String,
    required: true
  },
  handle: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String
  },
  profileImage: {
    type: String,
    default: 'default_profile_image.jpg'
  },
  bio: {
    type: String
  },
  description: {
    type: String
  },
  backgroundImage: {
    type: String,
    default: 'default_background_image.jpg'
  },
  socialMedia: [{
    name: {
      type: String,
    },
    link: {
      type: String,
    },
    icon: {
      type: String,
    }
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
