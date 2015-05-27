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

app.put('/users', function(req, res) {
  const authToken = req.headers['auth-token'];
  const user = req.body;

  axios
    .post(usersService + '/update', { authToken, user })
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

app.delete('/habits/:id', function(req, res) {
  const authToken = req.headers['auth-token'];
  const habitId = req.params.id;

  axios
    .post(habitsService + '/delete', { authToken, habitId })
    .then(response => res.json(response.data))
    .catch(err => res.status(err.status).json(err.data));
});

app.get('/habits/:id', function(req, res) {
  const authToken = req.headers['auth-token'];
  const habitId = req.params.id;

  axios
    .post(habitsService + '/get', { authToken, habitId })
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

app.put('/habits/:id', function(req, res) {
  const authToken = req.headers['auth-token'];
  const habitId = req.params.id;
  const habit = req.body;

  axios
    .post(habitsService + '/update', { authToken, habitId, habit })
    .then(response => res.json(response.data))
    .catch(err => res.status(err.status).json(err.data));
});

app.listen(process.env.SERVICE_PORT);
