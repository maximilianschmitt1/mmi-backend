'use strict';

let service = require('../../express-service');
let users   = require('./lib/users');
let port    = 5003;

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

server.listen(port);