'use strict';

let createError = require('create-error');

let errors = {
  ValidationError: createError('ValidationError'),
  AuthenticationError: createError('AuthenticationError')
};

module.exports = errors;