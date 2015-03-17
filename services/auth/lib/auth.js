'use strict';

let jwt    = require('jwt-simple');
let secret = require('../config').secret;
let co     = require('co');
let errors = require('./errors');
let axios  = require('axios');

let usersService = 'http://localhost:5003';

let auth = {
  authenticate(payload) {
    return co(function*() {
      let response = yield axios.post(usersService + '/authenticate', { credentials: payload.credentials });
      let user = response.data.user;

      if (!user) {
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
      throw new errors.InvalidTokenError('Invalid token');
    }

    return co(function*() {
      let response = yield axios.post(usersService + '/get', { userId });
      let user = response.data.user;

      if (!user) {
        throw new errors.InvalidTokenError('This token identifies a user not known to the system');
      }

      return user;
    });
  }
};

module.exports = auth;