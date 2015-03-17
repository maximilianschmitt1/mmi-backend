'use strict';

let auth    = require('./lib/auth');
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
    catch: 'AuthenticationError'
  }
]);

server.listen(port);