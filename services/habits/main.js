'use strict';

let habits  = require('./lib/habits');
let service = require('mirco');

let server = service(habits, [
  {
    method: 'activity',
    returns: 'activity',
    throws: 'AuthenticationError'
  },
  {
    method: 'list',
    returns: 'habits',
    throws: 'AuthenticationError'
  },
  {
    method: 'create',
    returns: 'habit',
    throws: ['ValidationError', 'AuthenticationError']
  },
  {
    method: 'delete',
    returns: 'habit',
    throws: ['AuthenticationError', 'AuthorizationError', 'ResourceNotFoundError']
  },
  {
    method: 'update',
    returns: 'habit',
    throws: ['AuthenticationError', 'AuthorizationError', 'ResourceNotFoundError']
  }
]);

server.listen(process.env.SERVICE_PORT);