'use strict';

let mp = require('mongodb-promises');
let db = mp.db(process.env.DB_HOST, process.env.DB_NAME);
db.ObjectID = mp.mongoDb.ObjectID;

export default db;