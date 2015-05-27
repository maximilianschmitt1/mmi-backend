'use strict';

var appUrl = process.env.APP_URL;
var mandrillApiKey = process.env.MANDRILL_API_KEY;
var usersService = process.env.USERS_SERVICE_URL;
var habitsService = process.env.HABITS_SERVICE_URL;

var axios = require('axios');
var cron = require('cron');
var moment = require('moment');
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var transport = nodemailer.createTransport(mandrillTransport({ auth: { apiKey: mandrillApiKey } }));

var job = new cron.CronJob('00 00 20 * * 0-6', onSchedule);
job.start();

function onSchedule() {
  usersToRemind().then(mapHabits).then(sendReminders).catch(onError);

  function usersToRemind() {
    return axios.post(usersService + '/list', {
      where: {
        remind: true
      }
    });
  }

  function mapHabits(res) {
    const users = res.data.users;
    const requests = users.map(function(user) {
      return axios.post(habitsService + '/habitsForUser', { userId: user._id }).then(setHabitsUser);

      function setHabitsUser(res) {
        return { user: user, habits: res.data.habits.filter(habitsWithoutActivityToday) };
      }

      function habitsWithoutActivityToday(habit) {
        return !habit.activities[moment().format('YYYYMMDD')];
      }
    });

    return Promise.all(requests);
  }

  function sendReminders(toAll) {
    toAll.forEach(function(to) {
      const user = to.user;
      const habits = to.habits;
      if (habits.length) {
        sendMail(user, habits, function(err, info) {
          if (err) {
            console.log('Error contacting', user.email);
            return;
          }

          console.log('Reminded', user.email);
        });
      }
    });
  }

  function onError(err) {
    setTimeout(function() {
      throw err;
    });
  }
}

function sendMail(user, habits, cb) {
  let body = 'Hey!\n\nWir wollten dich nur kurz erinnern, dass für heute noch Aktivitäten zu folgenden Habits ausstehen:\n';
  habits.forEach(function(habit) {
    body += '\n- ' + habit.name;
  });
  body += '\n\nBitte logge dich ein und gib für die jeweiligen Habits an, ob du das Tagesziel erreicht hast oder nicht. Falls du es heute nicht mehr schaffst, wird das heutige Tageszeil der ausstehenden Habits als verfehlt gezählt.\n\n';
  body += 'Logge dich jetzt ein: ' + appUrl;
  body += '\n\nFalls du diese Erinnerungsmails nicht mehr erhalten möchtest, versuch einfach immer vor 20 Uhr die Aktivitäten zu deinen Habits anzugeben. Ansonsten kannst du die Erinnerungen auch in den Einstellungen abschalten: ' + appUrl + '/#/settings';

  transport.sendMail({
    from: 'Team Habit <maximilian.schmitt@googlemail.com>',
    to: user.email,
    subject: 'Du hast ' + habits.length + ' ausstehende Habits',
    text: body
  }, cb);
}
