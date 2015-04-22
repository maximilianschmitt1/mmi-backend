'use strict';

let express     = require('express');
let axios       = require('axios');
let cors        = require('cors');
let bodyParser  = require('body-parser');

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
    .catch(err => res.status(err.status).json(err.data));
});

app.get('/auth/identify', function(req, res) {
  let authToken = req.headers['auth-token'];

  axios
    .post(authService + '/identify', { authToken })
    .then(response => res.json(response.data))
    .catch(err => res.status(err.status).json(err.data));
});

app.post('/users', function(req, res) {
  let user = req.body;

  axios
    .post(usersService + '/create', { user })
    .then(response => res.json(response.data))
    .catch(err => res.status(err.status).json(err.data));
});

app.post('/habits/:id/activity', function(req, res) {
  const authToken = req.headers['auth-token'];
  const habitId = req.params.id;
  const activity = req.body;

  axios
    .post(habitsService + '/activity', { authToken, habitId, activity })
    .then(response => res.json(response.data))
    .catch(err => res.status(err.status).json(err.data));
});

app.get('/habits/delete', function(req, res) {
  axios
    .post(habitsService + '/delete', {
      authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU1MGEzNDljOWNjNmJiZWQxY2U5NzM5OCJ9.M0NXmL_fHvbLgpXtsrUblJp-bhyzYlC4bCi6WcjOfbY',
      habitId: '5509ca71604e63f71f437204'
    })
    .then(response => res.json(response.data))
    .catch(err => res.status(err.status).json(err.data));
});

app.get('/habits', function(req, res) {
  let authToken = req.headers['auth-token'];
  axios
    .post(habitsService + '/list', { authToken })
    .then(response => res.json(response.data))
    .catch(err => res.status(err.status).json(err.data));
});

app.post('/habits', function(req, res) {
  let authToken = req.headers['auth-token'];
  let habit = req.body;

  axios
    .post(habitsService + '/create', { authToken, habit })
    .then(response => res.json(response.data))
    .catch(err => res.status(err.status).json(err.data));
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
    .catch(err => res.status(err.status).json(err.data));
});

app.listen(process.env.SERVICE_PORT);