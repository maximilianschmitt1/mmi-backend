'use strict';

let mp = require('mongodb-promises');
let db = mp.db('localhost', 'auth');
db.ObjectID = mp.mongoDb.ObjectID;

module.exports = db;