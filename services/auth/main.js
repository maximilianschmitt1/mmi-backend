'use strict';

let auth    = require('./lib/auth');
let errors  = require('./lib/errors');
let port    = require('./config').port;
let service = require('../../express-service');

let server = service(auth, [
  {
    method: 'authenticate',
    returns: 'authToken',
    catch: 'AuthenticationError'
  },
  {
    method: 'identify',
    returns: 'user',
    catch: 'InvalidTokenError'
  }
]);

server.listen(port);