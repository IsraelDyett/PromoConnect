const mongoose = require('mongoose');
const User = require('./User');

const ambassadorSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  skills: {
    type: [String]
  }
});

const Ambassador = User.discriminator(
  'Ambassador',
  ambassadorSchema,
  { discriminatorKey: 'role' }
);

module.exports = Ambassador;
