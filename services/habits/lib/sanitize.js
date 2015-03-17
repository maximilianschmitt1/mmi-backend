'use strict';

let sanee = require('sanee');

let sanitize = {
  create: sanee({
    name: sanee.trim().toString()
  }),
  update: sanee({
    name: sanee.trim().toString()
  })
};

module.exports = sanitize;