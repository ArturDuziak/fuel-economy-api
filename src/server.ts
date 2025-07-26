import fastify, { FastifyBaseLogger, FastifyInstance } from 'fastify';
import { logger } from './logger';
import tripsRoutes from './routes/v1/trips';

export async function initServer(): Promise<FastifyInstance> {
  const server = fastify({
    loggerInstance: logger as FastifyBaseLogger,
  });

  server.get('/health', (req, res) => res.send('OK'));
  server.log.info('Server initialized');

  await server.register(tripsRoutes, { prefix: '/v1' });

  return server;
}
