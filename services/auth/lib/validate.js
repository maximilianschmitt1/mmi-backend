'use strict';

import valee from 'valee';
import co from 'co';
import db from '../db';
import errors from './errors';

// validates and sanitizes user input
let validate = {
  registration(userData) {
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
        throw new errors.ValidationError('', { invalidFields: validationErrors });
      }
    });
  }
};

export default validate;