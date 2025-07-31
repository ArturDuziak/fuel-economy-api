import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { List, Add, Get } from '../../schemas/trips';
import { NotFoundError } from '../../db/errors';

const routeBaseSchema = {
  tags: ['Trips'],
};

const UserIdParamsSchema = z.object({
  userId: z.string().uuid(),
});

const NotFoundErrorSchema = z.object({
  message: z.string(),
});

async function tripsRoutes(server: FastifyInstance) {
  server.get<{ Params: { userId: string } }>(
    '/list',
    {
      schema: {
        ...routeBaseSchema,
        description: 'List all trips for a given user',
        params: zodToJsonSchema(UserIdParamsSchema),
        response: { 200: List.ResponseJsonSchema },
      },
    },
    async (req, res) => {
      const { userId } = req.params;

      const trips = await server.db.getTrips(userId);

      return res.send(trips);
    },
  );

  server.get<{ Params: { userId: string; tripId: string } }>(
    '/:tripId',
    {
      schema: {
        ...routeBaseSchema,
        description: 'Get a trip for a given user',
        params: zodToJsonSchema(UserIdParamsSchema.extend({ tripId: z.string().uuid() })),
        response: {
          200: Get.ResponseJsonSchema,
          404: zodToJsonSchema(NotFoundErrorSchema),
        },
      },
    },
    async (req, res) => {
      const { userId, tripId } = req.params;

      try {
        const trip = await server.db.getTrip(userId, tripId);
        return res.send(trip);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return res.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  );

  server.post<{ Body: Add.Request; Params: { userId: string } }>(
    '/add',
    {
      schema: {
        ...routeBaseSchema,
        description: 'Add a new trip for a given user',
        params: zodToJsonSchema(UserIdParamsSchema),
        body: Add.RequestJsonSchema,
        response: { 201: Add.ResponseJsonSchema },
      },
    },
    async (req, res) => {
      const { userId } = req.params;

      const parsedFuelConsumption = Number(req.body.fuelConsumption.toFixed(1));
      const parsedTravelTime = Number(req.body.travelTime.toFixed(0));

      const trip = await server.db.addTrip({
        userId,
        ...req.body,
        fuelConsumption: parsedFuelConsumption,
        travelTime: parsedTravelTime,
      });

      return res.status(201).send(trip);
    },
  );
}

export default async function (fastify: FastifyInstance) {
  fastify.register(tripsRoutes, { prefix: '/trips/:userId' });
}
