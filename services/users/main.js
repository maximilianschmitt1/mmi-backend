'use strict';

let users   = require('./lib/users');
let service = require('express-micro-service');

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