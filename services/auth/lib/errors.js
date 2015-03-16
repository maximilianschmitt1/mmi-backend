'use strict';

let createError = require('create-error');

let errors = {
  ValidationError: createError('ValidationError'),
  AuthenticationError: createError('AuthenticationError'),
  InvalidTokenError: createError('InvalidTokenError'),
  ResourceNotFoundError: createError('ResourceNotFoundError')
};

module.exports = errors;