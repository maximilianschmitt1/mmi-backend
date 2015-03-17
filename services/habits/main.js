'use strict';

import habits from './lib/habits';
import config from './config';
import service from '../../express-service';

let server = service(habits, [
  {
    method: 'create',
    returns: 'habit',
    catch: 'AuthenticationError'
  },
  {
    method: 'delete',
    returns: 'habit',
    catch: ['AuthenticationError', 'AuthorizationError', 'ResourceNotFoundError']
  }
]);

server.listen(config.port);