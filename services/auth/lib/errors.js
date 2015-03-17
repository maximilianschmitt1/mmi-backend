'use strict';

let createError = require('create-error');

let errors = {
  AuthenticationError: createError('AuthenticationError'),
  InvalidTokenError: createError('InvalidTokenError')
};

module.exports = errors;