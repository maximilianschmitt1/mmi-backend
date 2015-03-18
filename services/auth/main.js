'use strict';

let auth    = require('./lib/auth');
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

server.listen(process.env.SERVICE_PORT);