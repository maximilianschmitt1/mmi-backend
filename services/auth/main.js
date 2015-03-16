'use strict';

let auth    = require('./lib/auth');
let errors  = require('./lib/errors');
let port    = require('./config').port;
let service = require('../../express-service');

let server = service(auth, [
  {
    method: 'register',
    returns: 'user',
    catch: 'ValidationError'
  },
  {
    method: 'authenticate',
    returns: 'authToken',
    catch: 'AuthenticationError'
  },
  {
    method: 'identify',
    returns: 'user',
    catch: ['ResourceNotFoundError', 'InvalidTokenError']
  }
]);

server.listen(port);