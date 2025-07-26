import fastify, { FastifyBaseLogger, FastifyInstance } from 'fastify';
import { logger } from './logger';

export function initServer(): FastifyInstance {
  const server = fastify({
    loggerInstance: logger as FastifyBaseLogger,
  });

  server.get('/health', (req, res) => res.send('OK'));
  server.log.info('Server initialized');

  return server;
}
