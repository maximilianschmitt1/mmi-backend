'use strict';

let db = require('mongodb-promises').db('localhost', 'auth');

module.exports = db;