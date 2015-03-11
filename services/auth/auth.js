'use strict';

let jwt        = require('jwt-simple');
let secret     = require('./config').secret;
let db         = require('./db');
let co         = require('co');
let errors     = require('./errors');
let sanee      = require('sanee');
let omit       = require('object.omit');
let thenifyAll = require('thenify-all');
let bcrypt     = thenifyAll(require('bcrypt'));
let valee      = require('valee');

let auth = {
  register(payload) {
    let sanitize = sanee({
      email: sanee.trim().normalizeEmail({ lowercase: true }),
      password: sanee.toString(),
      passwordConfirmation: sanee.toString()
    });

    let userData = sanitize(payload);

    let validate = valee({
      email: valee.isEmail(),
      password: valee.isLength(6),
      passwordConfirmation: valee.equals(userData.password)
    });

    let validationErrors = validate(userData);

    if (Object.keys(validationErrors).length > 0) {
      throw new errors.ValidationError('', { invalidFields: validationErrors });
    }

    return co(function*() {
      userData.password = yield bcrypt.hash(userData.password, yield bcrypt.genSalt(10));
      let users = db.collection('users');
      let result = yield users.insert(omit(userData, 'passwordConfirmation'));
      return omit(result[0], 'password');
    });
  },
  authenticate(payload) {
    let sanitize = sanee({
      email: sanee.trim().normalizeEmail({ lowercase: true }),
      password: sanee.toString()
    });

    let userData = sanitize(payload);

    return co(function*() {
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
  }
};

module.exports = auth;