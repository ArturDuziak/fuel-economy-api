import fastify, { FastifyBaseLogger, FastifyInstance } from 'fastify';
import { logger } from './logger';
import tripsRoutes from './routes/v1/trips';
import inMemoryDbPlugin from './db/in-memory';
import { DatabaseInterface } from './db/interfaces';
import { FastifyPluginAsync } from 'fastify';

type ServerOptions = {
  dbPlugin?: FastifyPluginAsync;
};

declare module 'fastify' {
  interface FastifyInstance {
    db: DatabaseInterface;
  }
}

export async function initServer({ dbPlugin }: ServerOptions = {}): Promise<FastifyInstance> {
  const server = fastify({
    loggerInstance: logger as FastifyBaseLogger,
  });

  server.get('/health', (req, res) => res.send('OK'));
  server.log.info('Server initialized');

  await server.register(dbPlugin || inMemoryDbPlugin);

  await server.register(tripsRoutes, { prefix: '/v1' });

  return server;
}
