import fastify, { FastifyBaseLogger, FastifyInstance } from 'fastify';
import { logger } from './logger';
import tripsRoutes from './routes/v1/trips';
import authRoutes from './routes/v1/auth';
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

  await server.register(import('@fastify/swagger'), {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Fuel Economy API',
        description: 'API to manage fuel economy data',
        version: '0.1.0',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT}`,
          description: 'Development server',
        },
      ],
    },
  });

  await server.register(import('@fastify/swagger-ui'), {
    logLevel: 'silent',
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    theme: {
      title: 'Fuel Economy API',
    },
  });

  server.get(
    '/health',
    {
      schema: {
        description: 'Health check',
        tags: ['System'],
      },
    },
    (req, res) => res.send('OK'),
  );

  server.get(
    '/metrics',
    {
      schema: {
        description: 'Get metrics',
        tags: ['System'],
      },
    },
    (req, res) => res.send('Soon...'),
  );

  await server.register(dbPlugin || inMemoryDbPlugin);

  await server.register(tripsRoutes, { prefix: '/v1' });
  await server.register(authRoutes, { prefix: '/v1' });

  return server;
}
