'use strict';

let valee = require('valee');

let validate = {
  habit: valee({
    name: valee.isLength(1)
  })
};

module.exports = validate;