'use strict';

let sanee = require('sanee');

let sanitize = {
  create: sanee({
    name: sanee.trim().toString()
  }),
  delete: function(habitId) {
    return habitId;
  }
};

module.exports = sanitize;