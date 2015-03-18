'use strict';

let env                 = process.env;
let jwt                 = require('jwt-simple');
let co                  = require('co');
let AuthenticationError = require('create-error')('AuthenticationError');
let axios               = require('axios');

let tokenSecret         = env.TOKEN_SECRET;
let usersService        = env.USERS_SERVICE_URL;

let auth = {
  authenticate(payload) {
    return co(function*() {
      let response = yield axios.post(usersService + '/authenticate', { credentials: payload.credentials });
      let user = response.data.user;

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      return jwt.encode({ id: user._id }, tokenSecret);
    });
  },

  identify(payload) {
    let token = payload.authToken;
    let userId;

    try {
      userId = jwt.decode(token, tokenSecret).id;
    } catch(err) {
      throw new AuthenticationError('Invalid token');
    }

    return co(function*() {
      let response = yield axios.post(usersService + '/get', { userId });
      let user = response.data.user;

      if (!user) {
        throw new AuthenticationError('This token identifies a user not known to the system');
      }

      return user;
    });
  }
};

module.exports = auth;