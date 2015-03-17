'use strict';

import co from 'co';
import express from 'express';
import bodyParser from 'body-parser';

let service = function(service, endpoints) {
  let app = express();
  app.use(bodyParser.json());

  endpoints.forEach(endpoint => {
    app.post('/' + endpoint.method, function(req, res) {
      let payload = req.body;

      co(function*() {
        try {
          let response = { success: true };
          response[endpoint.returns] = yield service[endpoint.method](payload);
          res.json(response);
        } catch(err) {
          if (!endpoint.catch || endpoint.catch.indexOf(err.name) === -1) {
            console.log(err);
            if (err.stack) {
              console.log(err.stack);
            }

            res.status(500).json({ error: { name: 'Error', message: 'An unexpected error occurred. ' } });
            return;
          }

          res.status(400).json({ error: Object.assign({ name: err.name }, err) });
        }
      });
    });
  });

  return app;
};

export default service;