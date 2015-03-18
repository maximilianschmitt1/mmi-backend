'use strict';

let service = require('../../express-service');
let users   = require('./lib/users');

let server = service(users, [
  {
    method: 'create',
    returns: 'user',
    catch: 'ValidationError'
  },
  {
    method: 'authenticate',
    returns: 'user'
  },
  {
    method: 'get',
    returns: 'user'
  }
]);

server.listen(process.env.SERVICE_PORT);