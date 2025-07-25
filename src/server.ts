import fastify, { FastifyInstance } from 'fastify';

export function initServer(): FastifyInstance {
  const server = fastify();

  server.get('/health', (req, res) => res.send('OK'));

  return server;
}
