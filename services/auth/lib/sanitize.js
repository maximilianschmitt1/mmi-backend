'use strict';

import sanee from 'sanee';

let sanitize = {
  registration: sanee({
    email: sanee.trim().normalizeEmail({ lowercase: true }),
    password: sanee.toString(),
    passwordConfirmation: sanee.toString()
  }),
  authentication: sanee({
    email: sanee.trim().normalizeEmail({ lowercase: true }),
    password: sanee.toString()
  })
};

export default sanitize;