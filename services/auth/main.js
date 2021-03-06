'use strict';

let auth    = require('./lib/auth');
let service = require('mirco');

let server = service(auth, [
  {
    method: 'authenticate',
    returns: ['authToken', 'user'],
    throws: 'AuthenticationError'
  },
  {
    method: 'identify',
    returns: 'user',
    throws: 'AuthenticationError'
  }
]);

server.listen(process.env.SERVICE_PORT);