'use strict';

let sanee = require('sanee');

let sanitize = {
  creation: sanee({
    email: sanee.trim().normalizeEmail({ lowercase: true }),
    password: sanee.toString(),
    passwordConfirmation: sanee.toString()
  }),
  credentials: sanee({
    email: sanee.trim().normalizeEmail({ lowercase: true }),
    password: sanee.toString()
  }),
  get: function(userId) {
    return userId;
  }
};

module.exports = sanitize;