const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  pid: {
    type: String,
    unique: true,
  },

  total_games: {
    type: Number,
    default: 0,
  },

  losses: {
    type: Number,
    default: 0,
  },

  wins: {
    type: Number,
    default: 0,
  },

  grades: {
    type: Array,
    default: [],
  },

  level: {
    type: Number,
    default: 0,
  },

  exp: {
    type: Number,
    default: 0,
  },

  tier_points: {
    type: Number,
    default: 0,
  },

  medals: {
    type: Object,
    default: { gold: 0, silver: 0, bronze: 0 },
  },
  warTimes: {
    type: Array,
    default: [
      {
        longestWin: 0,
        fastestWin: 0,
        avgWin: 0,
        wins: 0,
        losses: 0,
      },
      {
        longestWin: 0,
        fastestWin: 0,
        avgWin: 0,
        wins: 0,
        losses: 0,
      },
      {
        longestWin: 0,
        fastestWin: 0,
        avgWin: 0,
        wins: 0,
        losses: 0,
      },
    ],
  },
  warHistory: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('UserData', userDataSchema, 'userData');
