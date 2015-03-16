'use strict';

let jwt        = require('jwt-simple');
let secret     = require('../config').secret;
let db         = require('../db');
let co         = require('co');
let errors     = require('./errors');
let omit       = require('object.omit');
let thenifyAll = require('thenify-all');
let bcrypt     = thenifyAll(require('bcrypt'));
let validate   = require('./validate');
let sanitize   = require('./sanitize');

let auth = {
  register(payload) {
    return co(function*() {
      let userData = sanitize.registration(payload);
      yield validate.registration(userData);

      userData.password = yield bcrypt.hash(userData.password, yield bcrypt.genSalt(10));

      let users = db.collection('users');
      let result = yield users.insert(omit(userData, 'passwordConfirmation'));

      return omit(result[0], 'password');
    });
  },

  authenticate(payload) {
    return co(function*() {
      let userData = sanitize.authentication(payload);

      let users = db.collection('users');
      let user = yield users.findOne({ email: userData.email });

      if (!user) {
        throw new errors.AuthenticationError('Incorrect credentials');
      }

      let passwordsMatch = yield bcrypt.compare(userData.password, user.password);

      if (!passwordsMatch) {
        throw new errors.AuthenticationError('Incorrect credentials');
      }

      return jwt.encode({ id: user._id }, secret);
    });
  },

  identify(payload) {
    let token = payload.authToken;
    let userId;

    try {
      userId = jwt.decode(token, secret).id;
    } catch(err) {
      throw new errors.InvalidTokenError();
    }

    return co(function*() {
      let user = yield db.collection('users').findOne({ _id: new db.ObjectID(userId) });

      if (!user) {
        throw new errors.ResourceNotFoundError('This token identifies a user not known to the system');
      }

      return omit(user, 'password');
    });
  }
};

module.exports = auth;