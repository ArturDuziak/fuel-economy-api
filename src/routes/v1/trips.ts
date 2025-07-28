import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { List, Add } from '../../schemas/trips';

const routeBaseSchema = {
  tags: ['Trips'],
};

const UserIdParamsSchema = zodToJsonSchema(
  z.object({
    userId: z.string().uuid(),
  }),
);

async function tripsRoutes(server: FastifyInstance) {
  server.get<{ Params: { userId: string } }>(
    '/list',
    {
      schema: {
        ...routeBaseSchema,
        params: UserIdParamsSchema,
        response: { 200: List.ResponseJsonSchema },
      },
    },
    async (req, res) => {
      const { userId } = req.params;

      const trips = await server.db.getTrips(userId);

      return res.send(trips);
    },
  );

  server.post<{ Body: Add.Request; Params: { userId: string } }>(
    '/add',
    {
      schema: {
        ...routeBaseSchema,
        params: UserIdParamsSchema,
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
