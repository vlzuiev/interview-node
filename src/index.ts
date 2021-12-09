import 'reflect-metadata';
import './preStart';
import { Application } from './Application';
import logger from './logger/Logger';

Application.startUp().catch((e) => {
  logger.err('Uncaught exception! Application will terminate', e);
});
