'use strict';

let sanee = require('sanee');

let sanitize = {
  activity: sanee({
    type: sanee.trim().toString()
  }),
  create: sanee({
    name: sanee.trim().toString()
  }),
  update: sanee({
    name: sanee.trim().toString()
  })
};

module.exports = sanitize;