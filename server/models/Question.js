const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  index: {
    type: Number,
    unique: true
  },
  level: { type: String },
  question: { type: Object },
  example: { type: Object },
  constraints: { type: Array },
  signature: { type: String },
  type: { type: String },
  test_cases: { type: Array }
});

module.exports = mongoose.model('Question', questionSchema, 'questions');
