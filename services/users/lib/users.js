'use strict';

let co         = require('co');
let sanitize   = require('./sanitize');
let validate   = require('./validate');
let thenifyAll = require('thenify-all');
let bcrypt     = thenifyAll(require('bcrypt'));
let db         = require('../db');
let omit       = require('object.omit');
let axios      = require('axios');

const authService = process.env.AUTH_SERVICE_URL;

let users = {
  update: function(payload) {
    return co(function*() {
      const user = yield userForAuthToken(payload.authToken);
      const userData = sanitize.update(payload.user);

      const users = db.collection('users');
      yield users.update({ _id: new db.ObjectID(user._id) }, userData);
      const result = yield users.findOne({ _id: new db.ObjectID(user._id) });

      return omit(result, 'password');
    });
  },
  create: function(payload) {
    return co(function*() {
      let userData = sanitize.creation(payload.user);
      yield validate.creation(userData);

      userData.password = yield bcrypt.hash(userData.password, yield bcrypt.genSalt(10));
      userData.remind = true;

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
  list: function(payload) {
    const users = db.collection('users');
    return users.find(payload.where || {}).then(users => users.map(user => omit(user, 'password')));
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

function userForAuthToken(authToken) {
  return axios
    .post(authService + '/identify', { authToken })
    .then(res => res.data.user);
}

module.exports = users;
