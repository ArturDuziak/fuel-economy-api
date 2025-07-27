import { FastifyInstance } from 'fastify';
import { List } from '../../schemas/trips';

const routeBaseSchema = {
  tags: ['Trips'],
};

async function tripsRoutes(server: FastifyInstance) {
  server.get<{ Querystring: { userId: string } }>(
    '/list',
    {
      schema: {
        ...routeBaseSchema,
        querystring: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
            },
          },
          required: ['userId'],
        },
        response: { 200: List.ResponseJsonSchema },
      },
    },
    async (req, res) => {
      const trips = await server.db.getTrips(req.query.userId);

      return res.send(trips);
    },
  );
}

export default async function (fastify: FastifyInstance) {
  fastify.register(tripsRoutes, { prefix: '/trips' });
}
