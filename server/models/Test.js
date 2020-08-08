const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  pid: {
    type: String,
    unique: true
  },
  data: {
    type: Array,
    default: []
  },
  indexes: {
    type: Array,
    default: []
  },
  pre_level: {
    type: String
  },
  institute: {
    type: String
  }
});

module.exports = mongoose.model('Test', testSchema, 'tests');
