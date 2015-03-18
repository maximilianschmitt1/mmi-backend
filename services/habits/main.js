'use strict';

let habits  = require('./lib/habits');
let service = require('../../express-service');

let server = service(habits, [
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