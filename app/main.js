'use strict';

import express from 'express';

let app = express();

app.get('/', (req, res) => {
  res.end('hello');
});

app.listen(8080);