'use strict';

import co from 'co';
import db from '../db';
import axios from 'axios';

let authService = 'http://localhost:5001';

let habits = {
  create: function(payload) {
    return co(function*() {
      let { habit, authToken } = payload;

      let authResponse = yield axios.post(authService + '/identify', { authToken });
      let user = authResponse.data.user;
      habit.userId = user._id;

      let habits = db.collection('habits');
      let result = yield habits.insert(habit);
      
      return result[0];
    });
  }
};

export default habits;