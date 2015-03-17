'use strict';

let valee           = require('valee');
let co              = require('co');
let ValidationError = require('create-error')('ValidationError');
let db              = require('../db');

let validate = {
  creation: function(userData) {
    return co(function*() {
      let validate = valee({
        email: valee.isEmail(),
        password: valee.isLength(6),
        passwordConfirmation: valee.equals(userData.password)
      });

      let validationErrors = validate(userData);

      // check if email is taken
      if (!validationErrors.email && (yield db.collection('users').findOne({ email: userData.email }))) {
          validationErrors.email = 'Already registered';
      }

      if (Object.keys(validationErrors).length > 0) {
        throw new ValidationError('', { invalidFields: validationErrors });
      }
    });
  }
};

module.exports = validate;