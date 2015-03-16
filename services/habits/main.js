'use strict';

import habits from './lib/habits';
import config from './config';
import service from '../../express-service';

let server = service(habits, [
  {
    method: 'create',
    returns: 'habit',
    catch: ['ValidationError', 'AuthenticationError']
  },
]);

server.listen(config.port);