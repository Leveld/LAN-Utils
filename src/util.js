const USER_ERROR = 422;

const IS_DEVELOPMENT = (!process.env.PRODUCTION || process.env.PRODUCTION === 'false') && process.env.NODE_ENV !== 'production';
const IS_PRODUCTION = !IS_DEVELOPMENT;

const errorHandler = (error, req, res, next, message) => {
  message = (message || error ? error.message : undefined) || 'Oops! Looks like that doesn\'t work :(';
  const status = (error ? error.response ? error.response.status : error.status : undefined) || USER_ERROR;
  res.status(status).send(error && error.response ? error.response.data : { error: error ? error.stack : null, message });
};

const throwError = (name, message, status = USER_ERROR) => {
  const error = new Error(message);
  error.name = name;
  error.status = status;
  throw error;
};

const asyncMiddleware = cb =>
  (req, res, next) =>
    Promise.resolve(cb(req, res, next)).catch(error => errorHandler(error, req, res, next));

let frontServerIP = '';
let apiServerIP   = '';
let authServerIP  = '';
let dbServerIP    = '';
if (IS_DEVELOPMENT) {
  frontServerIP  = 'http://localhost.test:3000/';
  apiServerIP    = 'http://api.localhost.test:3001/';
  authServerIP   = 'http://auth.localhost.test:3002/';
  dbServerIP     = 'http://db.localhost.test:3003/';
  googleRedirect = 'http://localhost:3002/goauth';
} else {
  frontServerIP  = 'http://jourdanclark.com:3000/';
  apiServerIP    = 'http://api.jourdanclark.com:3001/';
  authServerIP   = 'http://auth.jourdanclark.com:3002/';
  dbServerIP     = 'http://db.jourdanclark.com:3003/';
  googleRedirect = 'http://jourdanclark.com:3002/goauth';
}

const logger = function (...messages) {
  if (IS_DEVELOPMENT)
    messages.forEach(message => console.log(message));
};
logger.log =   (...messages) => IS_DEVELOPMENT ? logger(...messages) : undefined;
logger.info =  (...messages) => IS_DEVELOPMENT ? messages.forEach(message => console.info(message))  : undefined;
logger.warn =  (...messages) => IS_DEVELOPMENT ? messages.forEach(message => console.warn(message))  : undefined;
logger.error = (...messages) => IS_DEVELOPMENT ? messages.forEach(message => console.error(message)) : undefined;

module.exports = {
  USER_ERROR,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  errorHandler,
  throwError,
  asyncMiddleware,
  frontServerIP,
  apiServerIP,
  authServerIP,
  dbServerIP,
  logger
};
