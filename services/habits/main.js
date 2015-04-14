'use strict';

let habits  = require('./lib/habits');
let service = require('express-micro-service');

let server = service(habits, [
  {
    method: 'list',
    returns: 'habits'
  },
  {
    method: 'create',
    returns: 'habit',
    throws: 'AuthenticationError'
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