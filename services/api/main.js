'use strict';

import dnode from 'dnode';

let d = dnode.connect(5001);

d.on('remote', authService => {
  // authService.register({
  //   email: 'maximilian.schmitt@googlemail.com',
  //   password: '123456',
  //   passwordConfirmation: '123456'
  // }, function(response) {
  //   console.log(response);
  // });

  authService.authenticate({
    email: 'maximilian.schmitt@googlemail.com',
    password: '123456'
  }, function(res) {
    console.log(res);
  });
});