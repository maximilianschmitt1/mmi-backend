'use strict';

let sanee = require('sanee');

let sanitize = {
  activity: sanee({
    type: sanee.trim().toString()
  }),
  create: sanee({
    name: sanee.trim().toString(),
    duration: sanee.toInt()
  }),
  update: sanee({
    name: sanee.trim().toString()
  })
};

module.exports = sanitize;