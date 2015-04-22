'use strict';

let co                    = require('co');
let axios                 = require('axios');
let db                    = require('../db');
let sanitize              = require('./sanitize');
let createError           = require('create-error');
let AuthorizationError    = createError('AuthorizationError');
let ResourceNotFoundError = createError('ResourceNotFoundError');

let authService = process.env.AUTH_SERVICE_URL;

let habits = {
  activity: function(payload) {
    return co(function*() {
      const authToken = payload.authToken;
      const habitId = payload.habitId;
      const user = yield userForAuthToken(authToken);
      const habits = db.collection('habits');
      const habit = yield habits.findOne({ userId: user._id, _id: new db.ObjectID(habitId) });

      const activity = sanitize.activity(payload.activity);
      const now = new Date();
      activity.time = now;
      habit.activities['' + now.getFullYear() + now.getMonth() + now.getDay()] = activity;

      yield habits.update({ _id: new db.ObjectID(habitId) }, habit);

      return habits.findOne({ _id: new db.ObjectID(habitId) });
    });
  },

  list: function(payload) {
    return co(function*() {
      let authToken = payload.authToken;
      let user = yield userForAuthToken(authToken);

      let habits = yield db.collection('habits').find({ userId: user._id });

      habits.forEach(function(habit) {
        habit.createdAt = (new db.ObjectID(habit._id)).getTimestamp();
      });

      return habits;
    });
  },

  create: function(payload) {
    return co(function*() {
      let habit = sanitize.create(payload.habit);
      habit.level = 1;
      habit.xp = 0;
      habit.activities = {};

      let authToken = payload.authToken;

      let user = yield userForAuthToken(authToken);

      habit.userId = user._id;

      let habits = db.collection('habits');
      let result = yield habits.insert(habit);
      
      return result[0];
    });
  },

  delete: function(payload) {
    return co(function*() {
      let habitId = payload.habitId;
      let authToken = payload.authToken;

      let user = yield userForAuthToken(authToken);

      let habits = db.collection('habits');
      let habit = yield habits.findOne({ _id: new db.ObjectID(habitId) });

      if (!habit) {
        throw new ResourceNotFoundError('', { resourceType: 'habit' });
      }

      if (habit.userId !== user._id) {
        throw new AuthorizationError('This habit does not belong to you');
      }

      try {
        yield habits.remove({ _id: new db.ObjectID(habitId) });
      } catch(err) {
        console.log(err);
      }

      return habit;
    });
  },

  update: function(payload) {
    return co(function*() {
      let habitData = sanitize.update(payload.habit);
      let habitId   = payload.habitId;
      let authToken = payload.authToken;

      let user = yield userForAuthToken(authToken);

      let habits = db.collection('habits');
      let habit = yield habits.findOne({ _id: new db.ObjectID(habitId) });

      if (!habit) {
        throw new ResourceNotFoundError('', { resourceType: 'habit' });
      }

      if (habit.userId !== user._id) {
        throw new AuthorizationError('This habit does not belong to you');
      }

      yield habits.update({ _id: new db.ObjectID(habitId) }, habitData);

      return habits.findOne({ _id: new db.ObjectID(habitId) });
    });
  }
};

function userForAuthToken(authToken) {
  return axios
    .post(authService + '/identify', { authToken })
    .then(res => res.data.user);
}

module.exports = habits;