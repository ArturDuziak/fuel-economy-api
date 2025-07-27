import fp from 'fastify-plugin';
import { Trip } from './types/trips';
import { DatabaseInterface, PluginName } from './interfaces';
import { FastifyInstance } from 'fastify';

export class InMemoryDatabase implements DatabaseInterface {
  private trips: Record<string, Trip[]> = {
    '00000000-0000-0000-0000-000000000000': [
      {
        id: '1',
        startDate: '2021-01-01T00:00:00Z',
        endDate: '2021-01-01T00:00:00Z',
        travelTime: 60,
        distance: 100,
        avgSpeed: 50,
        fuelConsumption: '4.5',
        startCoordinates: {
          lat: 40.7128,
          lng: -74.006,
        },
        endCoordinates: {
          lat: 40.7128,
          lng: -74.006,
        },
      },
    ],
  };

  async getTrips(userId: string): Promise<Trip[]> {
    return this.trips[userId] ?? [];
  }
}

export default fp(
  async (server: FastifyInstance) => {
    server.decorate(PluginName, new InMemoryDatabase());
  },
  {
    name: PluginName,
  },
);
