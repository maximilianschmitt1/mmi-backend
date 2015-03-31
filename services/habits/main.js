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
    catch: 'AuthenticationError'
  },
  {
    method: 'delete',
    returns: 'habit',
    catch: ['AuthenticationError', 'AuthorizationError', 'ResourceNotFoundError']
  },
  {
    method: 'update',
    returns: 'habit',
    catch: ['AuthenticationError', 'AuthorizationError', 'ResourceNotFoundError']
  }
]);

server.listen(process.env.SERVICE_PORT);