const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'none'],
  },
  first_player: { type: Object },
  second_player: { type: Object },
  progress: {
    type: String,
    enum: ['waiting', 'inGame', 'gameOver'],
  },
  planguage: { type: String, default: 'python' },
});

module.exports = mongoose.model('Room', roomSchema, 'rooms');
