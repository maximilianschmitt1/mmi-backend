'use strict';

let express    = require('express');
let axios      = require('axios');
let cors       = require('cors');
let bodyParser = require('body-parser');

let app = express();

let authService   = process.env.AUTH_SERVICE_URL;
let habitsService = process.env.HABITS_SERVICE_URL;
let usersService  = process.env.USERS_SERVICE_URL;

app.use(cors());
app.use(bodyParser.json());

app.post('/auth/authenticate', function(req, res) {
  let credentials = req.body;

  axios
    .post(authService + '/authenticate', { credentials })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.get('/auth/identify', function(req, res) {
  axios
    .post(authService + '/identify', {
      authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU1MGEzNDljOWNjNmJiZWQxY2U5NzM5OCJ9.M0NXmL_fHvbLgpXtsrUblJp-bhyzYlC4bCi6WcjOfbY'
    })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.post('/users', function(req, res) {
  let user = req.body;

  axios
    .post(usersService + '/create', { user })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.get('/habits/delete', function(req, res) {
  axios
    .post(habitsService + '/delete', {
      authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU1MGEzNDljOWNjNmJiZWQxY2U5NzM5OCJ9.M0NXmL_fHvbLgpXtsrUblJp-bhyzYlC4bCi6WcjOfbY',
      habitId: '5509ca71604e63f71f437204'
    })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.get('/habits/create', function(req, res) {
  axios
    .post(habitsService + '/create', {
      authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU1MGEzNDljOWNjNmJiZWQxY2U5NzM5OCJ9.M0NXmL_fHvbLgpXtsrUblJp-bhyzYlC4bCi6WcjOfbY',
      habit: {
        name: 'Some task'
      }
    })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.get('/habits/update', function(req, res) {
  axios
    .post(habitsService + '/update', {
      authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU1MGEzNDljOWNjNmJiZWQxY2U5NzM5OCJ9.M0NXmL_fHvbLgpXtsrUblJp-bhyzYlC4bCi6WcjOfbY',
      habitId: '5509ca62604e63f71f437203',
      habit: {
        name: 'Edited habit'
      }
    })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.listen(process.env.SERVICE_PORT);