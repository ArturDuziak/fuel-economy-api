import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { List, Add, Get, Update, Patch } from '../../schemas/trips';
import { NotFoundError } from '../../db/errors';

const NotFoundErrorSchema = z.object({
  message: z.string(),
});

async function tripsRoutes(server: FastifyInstance) {
  const config = {
    preHandler: [server.verifyJwtAuth],
  };

  const routeBaseSchema = {
    tags: ['Trips'],
  };

  server.get(
    '',
    {
      ...config,
      schema: {
        ...routeBaseSchema,
        description: 'List all trips for a given user',
        response: { 200: List.ResponseJsonSchema },
      },
    },
    async (req, res) => {
      const userId = req.tokenInfo.userId;

      const trips = await server.db.getTrips(userId);

      return res.send(trips);
    },
  );

  server.get<{ Params: { tripId: string } }>(
    '/:tripId',
    {
      ...config,
      schema: {
        ...routeBaseSchema,
        description: 'Get a trip for a given user',
        params: zodToJsonSchema(z.object({ tripId: z.string().uuid() })),
        response: {
          200: Get.ResponseJsonSchema,
          404: zodToJsonSchema(NotFoundErrorSchema),
        },
      },
    },
    async (req, res) => {
      const { tripId } = req.params;

      try {
        const trip = await server.db.getTrip(req.tokenInfo.userId, tripId);
        return res.send(trip);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return res.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  );

  server.post<{ Body: Add.Request }>(
    '',
    {
      ...config,
      schema: {
        ...routeBaseSchema,
        description: 'Add a new trip for a given user',
        body: Add.RequestJsonSchema,
        response: { 201: Add.ResponseJsonSchema },
      },
    },
    async (req, res) => {
      const userId = req.tokenInfo.userId;

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

  server.put<{ Body: Update.Request; Params: { tripId: string } }>(
    '/:tripId',
    {
      ...config,
      schema: {
        ...routeBaseSchema,
        description: 'Update a trip for a given user',
        params: zodToJsonSchema(z.object({ tripId: z.string().uuid() })),
        body: Update.RequestJsonSchema,
        response: { 200: Update.ResponseJsonSchema },
      },
    },
    async (req, res) => {
      const { tripId } = req.params;

      const parsedFuelConsumption = Number(req.body.fuelConsumption.toFixed(1));
      const parsedTravelTime = Number(req.body.travelTime.toFixed(0));

      try {
        const trip = await server.db.updateTrip({
          userId: req.tokenInfo.userId,
          tripId,
          ...req.body,
          fuelConsumption: parsedFuelConsumption,
          travelTime: parsedTravelTime,
        });

        return res.send(trip);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return res.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  );

  server.patch<{ Body: Patch.Request; Params: { tripId: string } }>(
    '/:tripId',
    {
      ...config,
      schema: {
        ...routeBaseSchema,
        description: 'Patch a trip for a given user',
        params: zodToJsonSchema(z.object({ tripId: z.string().uuid() })),
        body: Patch.RequestJsonSchema,
        response: { 200: Patch.ResponseJsonSchema },
      },
    },
    async (req, res) => {
      const { tripId } = req.params;

      const updateData = {
        userId: req.tokenInfo.userId,
        tripId,
        ...req.body,
      };

      if (req.body.fuelConsumption !== undefined) {
        updateData.fuelConsumption = Number(req.body.fuelConsumption.toFixed(1));
      }

      if (req.body.travelTime !== undefined) {
        updateData.travelTime = Number(req.body.travelTime.toFixed(0));
      }

      try {
        const trip = await server.db.patchTrip(updateData);

        return res.send(trip);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return res.status(404).send({ message: error.message });
        }
        console.error(error);

        throw error;
      }
    },
  );
}

export default async function (fastify: FastifyInstance) {
  fastify.register(tripsRoutes, { prefix: '/trips' });
}
