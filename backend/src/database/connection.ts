import knex from 'knex';
import { logger } from '../utils/logger';

const environment = process.env.NODE_ENV || 'development';
const config = require('../../knexfile')[environment];

export const db = knex(config);

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    logger.info('Database connection established successfully');
  })
  .catch((error) => {
    logger.error('Database connection failed:', error);
    process.exit(1);
  });

export default db; 