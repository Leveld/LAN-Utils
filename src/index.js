const { logger } = require('./util');

logger('hello');
logger.log('hello');
logger.info('hello');
logger.warn('hello');
logger.error('hello');


module.exports = {
  ...require('./util')
};
