'use strict';

const co                    = require('co');
const axios                 = require('axios');
const db                    = require('../db');
const sanitize              = require('./sanitize');
const validate              = require('./validate');
const createError           = require('create-error');
const values                = require('object-values');
const moment                = require('moment');
const level                 = require('./level');
const AuthorizationError    = createError('AuthorizationError');
const ValidationError       = createError('ValidationError');
const ResourceNotFoundError = createError('ResourceNotFoundError');

const authService = process.env.AUTH_SERVICE_URL;

const habits = {
  get: function(payload) {
    return co(function*() {
      const authToken = payload.authToken;
      const habitId = payload.habitId;
      const user = yield userForAuthToken(authToken);
      const habits = db.collection('habits');
      const habit = yield habits.findOne({ userId: user._id, _id: new db.ObjectID(habitId) });

      return prepareHabit(habit);
    });
  },
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
      activity.xp = activity.type === 'success' ? 100 : 0;
      habit.activities[moment(now).format('YYYYMMDD')] = activity;

      yield habits.update({ _id: new db.ObjectID(habitId) }, habit);

      return habits.findOne({ _id: new db.ObjectID(habitId) });
    });
  },

  list: function(payload) {
    return co(function*() {
      let authToken = payload.authToken;
      let user = yield userForAuthToken(authToken);

      let habits = (yield db.collection('habits').find({ userId: user._id })).map(prepareHabit).sort(sortHabits);

      return habits;
    });

    function sortHabits(a, b) {
      if (moment(a.createdAt).isBefore(moment(b.createdAt))) {
        return -1;
      }

      return 1;
    }
  },

  create: function(payload) {
    return co(function*() {
      let habit = sanitize.create(payload.habit);
      
      if (Object.keys(validate.habit(payload.habit)).length > 0)  {
        throw new ValidationError();
      }

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

      yield habits.remove({ _id: new db.ObjectID(habitId) });

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

function prepareHabit(habit) {
  habit.createdAt = (new db.ObjectID(habit._id)).getTimestamp();
  habit.xp = values(habit.activities).reduce((last, curr) => last + curr.xp, 0);
  habit.level = level.fromXp(habit.xp);
  habit.duration = 66;
  return habit;
}

module.exports = habits;