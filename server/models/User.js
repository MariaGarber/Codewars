const mongoose = require('mongoose');

const registerDate = () => {
  let d = new Date();
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
  let fullDate = day + '/' + month + '/' + year;
  return fullDate;
};

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },

  lastName: {
    type: String,
    // required: true,
    trim: true,
    minlength: 3,
  },

  email: {
    type: String,
    // required: true,
    trim: true,
    unique: true,
  },

  password: {
    type: String,
    // required: true,
    trim: true,
    minlength: 6,
  },

  startDate: {
    type: String,
    // required: true,
    trim: true,
  },

  country: {
    type: String,
    // required: true,
    trim: true,
  },

  gender: {
    type: String,
    // required: true,
    trim: true,
  },

  tier: {
    type: String,
    default: 'none',
    enum: ['easy', 'medium', 'hard', 'none'],
  },

  memberSince: {
    type: String,
    default: registerDate,
    trim: true,
  },

  lastSeen: {
    type: String,
    default: registerDate,
    trim: true,
  },
  profileImg: {
    type: String,
    default: 'male',
    trim: true,
  },

  friends: {
    type: Array,
    default: [],
  },

  alerts: {
    type: Array,
    default: [],
  },
});

userSchema.statics = {
  searchPartial: function (q, callback) {
    return this.find(
      {
        $or: [
          { firstName: new RegExp(q, 'gi') },
          { lastName: new RegExp(q, 'gi') },
        ],
      },
      callback
    );
  },

  searchFull: function (q, callback) {
    return this.find(
      {
        $text: { $search: q, $caseSensitive: false },
      },
      callback
    );
  },

  search: function (q, callback) {
    this.searchFull(q, (err, data) => {
      if (err) return callback(err, data);
      if (!err && data.length) return callback(err, data);
      if (!err && data.length === 0) return this.searchPartial(q, callback);
    });
  },
};

module.exports = mongoose.model('User', userSchema);
