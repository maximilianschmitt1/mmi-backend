'use strict';

let dnode  = require('dnode');
let co     = require('co');
let auth   = require('./auth');
let port   = require('./config').port;
let errors = require('./errors');

let server = dnode({
  register(payload, cb) {
    co(function*() {
      try {
        let user = yield auth.register(payload);
        cb({ success: true, user });
      } catch(err) {
        cb({
          error: Object.assign({ name: err.name }, err)
        });
      }
    });
  },
  authenticate(payload, cb) {
    co(function*() {
      try {
        let token = yield auth.authenticate(payload);
        cb({ success: true, token });
      } catch(err) {
        if (err.name !== 'AuthenticationError') {
          console.log(err.stack);
        }

        cb({
          error: Object.assign({ name: err.name }, err)
        });
      }
    });
  }
});

server.listen(port);