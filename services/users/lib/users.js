'use strict';

let co         = require('co');
let sanitize   = require('./sanitize');
let validate   = require('./validate');
let thenifyAll = require('thenify-all');
let bcrypt     = thenifyAll(require('bcrypt'));
let db         = require('../db');
let omit       = require('object.omit');

let users = {
  create: function(payload) {
    return co(function*() {
      let userData = sanitize.creation(payload.user);
      yield validate.creation(userData);

      userData.password = yield bcrypt.hash(userData.password, yield bcrypt.genSalt(10));

      let users = db.collection('users');
      let result = yield users.insert(omit(userData, 'passwordConfirmation'));

      return omit(result[0], 'password');
    });
  },
  authenticate: function(payload) {
    return co(function*() {
      let credentials = sanitize.credentials(payload.credentials);
      let users = db.collection('users');
      let user = yield users.findOne({ email: credentials.email });

      if (!user || (user && !(yield bcrypt.compare(credentials.password, user.password)))) {
        return null;
      }

      return omit(user, 'password');
    });
  },
  get: function(payload) {
    return co(function*() {
      let userId = sanitize.get(payload.userId);
      let users = db.collection('users');
      let user = yield users.findOne({ _id: new db.ObjectID(userId) });

      if (!user) {
        return null;
      }

      return omit(user, 'password');
    });
  }
};

module.exports = users;