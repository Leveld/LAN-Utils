const USER_ERROR = 422;
const BETA = true;

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

const forEachAsync = async (array, cb) => {
  if (!Array.isArray(array))
    return;

  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i);
  }
};

const mapAsync = async (array, cb) => {
  const newArray = [];

  if (!Array.isArray(array))
    return [];

  for (let i = 0; i < array.length; i++) {
    newArray[i] = await cb(array[i], i);
  }

  return newArray;
};

const reduceAsync = async (array, cb, ...args) => {
  if (!Array.isArray(array))
    return;

  if (array.length === 1)
    return array[0];

  let returnValue;
  let startIndex = 0;
  if (args.length > 0) {
    returnValue = args[0];
  } else {
    returnValue = array[0];
    startIndex++;
  }

  for (let i = startIndex; i < array.length; i++) {
    returnValue = await cb(returnValue, array[i], i);
  }

  return returnValue;
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
  frontServerIP  = 'https://leveld-frontend.herokuapp.com/';
  apiServerIP    = 'https://leveld-api.herokuapp.com/';
  authServerIP   = 'https://leveld-auth.herokuapp.com/';
  dbServerIP     = 'https://leveld-db.herokuapp.com/';
  googleRedirect = 'https://leveld-auth.herokuapp.com/goauth/';
}

const defaultUserPicture = `${frontServerIP}images/noPhoto.jpg`;
const defaultCPPicture   = `${frontServerIP}images/noPhoto.jpg`;
const defaultBAPicture   = `${frontServerIP}images/noPhoto.jpg`;
const defaultMAPicture   = `${frontServerIP}images/noPhoto.jpg`;

const logger = function (...messages) {
  if (IS_DEVELOPMENT)
    messages.forEach(message => console.log(message));
};
logger.log =   (...messages) => IS_DEVELOPMENT ? logger(...messages) : undefined;
logger.info =  (...messages) => IS_DEVELOPMENT ? messages.forEach(message => console.info(message))  : undefined;
logger.warn =  (...messages) => IS_DEVELOPMENT ? messages.forEach(message => console.warn(message))  : undefined;
logger.error = (...messages) => IS_DEVELOPMENT ? messages.forEach(message => console.error(message)) : undefined;

const waitAsync = ms =>
  new Promise((resolve, reject) => setTimeout(() => resolve(), ms));

const parallelAsync = (...functions) =>
  Promise.all(functions.map((func) => func()));

const zip = (...items) => {
  const zip = [];
  let arrcount = 0;
  items.forEach((item) => item.length > arrcount ? arrcount=item.length : null);
  for(let i = 0; i < arrcount; i++){
    const arrItem = new Array(items.length);
    zip.push(arrItem);
  }
  for(let i = 0; i < items.length; i++){
    for(let j = 0; j < arrcount; j++){
      zip[j][i] = items[i][j];
    }
  }
  return zip;
}

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
  googleRedirect,
  logger,
  defaultUserPicture,
  defaultCPPicture,
  defaultBAPicture,
  defaultMAPicture,
  forEachAsync,
  mapAsync,
  reduceAsync,
  waitAsync,
  parallelAsync,
  zip,
  BETA
};
