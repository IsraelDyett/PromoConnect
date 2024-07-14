const mongoose = require('mongoose');
const User = require('./User');

const companySchema = new mongoose.Schema({
  contactPerson: {
    type: String
  },
  website: {
    type: String
  },
  industry: {
    type: String
  },
  companyName: {
    type: String,
  }
});

const Company = User.discriminator(
  'Company',
  companySchema,
  { discriminatorKey: 'role' }
);

module.exports = Company;
