'use strict';

import express from 'express';
import axios from 'axios';

let app = express();

let authService   = 'http://localhost:5001';
let habitsService = 'http://localhost:5002';
let usersService  = 'http://localhost:5003';

app.get('/auth/authenticate', function(req, res) {
  axios
    .post(authService + '/authenticate', {
      credentials: {
        email: 'maximilian.schmitt@googlemail.com',
        password: '123456'
      }
    })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.get('/auth/identify', function(req, res) {
  axios
    .post(authService + '/identify', {
      authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU1MDU5ZmQ0MzYyNzIyYWMyNzdhODBkNSJ9.Tad3TwWgBIgtAEvEioanElE3Q878fZrPTtdUe6Dekcg'
    })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.get('/users/create', function(req, res) {
  axios
    .post(usersService + '/create', {
      user: {
        email: 'maximilian.schmitt@googlemail.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.get('/habits/delete', function(req, res) {
  axios
    .post(habitsService + '/delete', {
      authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU1MDU5ZmQ0MzYyNzIyYWMyNzdhODBkNSJ9.Tad3TwWgBIgtAEvEioanElE3Q878fZrPTtdUe6Dekcg',
      habitId: '5508a7dfd4cf97740a0d2095'
    })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.get('/habits/create', function(req, res) {
  axios
    .post(habitsService + '/create', {
      authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU1MDU5ZmQ0MzYyNzIyYWMyNzdhODBkNSJ9.Tad3TwWgBIgtAEvEioanElE3Q878fZrPTtdUe6Dekcg',
      habit: {
        name: 'Some task'
      }
    })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.data));
});

app.listen(8080);