import { randomUUID } from 'node:crypto';
import fp from 'fastify-plugin';
import { Trip } from './types/trips';
import { AddTripParams, DatabaseInterface, PluginName } from './interfaces';
import { FastifyInstance } from 'fastify';

export class InMemoryDatabase implements DatabaseInterface {
  private trips: Record<string, Trip[]> = {};

  async getTrips(userId: string): Promise<Trip[]> {
    return this.trips[userId] ?? [];
  }

  async addTrip(params: AddTripParams): Promise<Trip> {
    if (!this.trips[params.userId]) {
      this.trips[params.userId] = [];
    }

    const trip = {
      id: randomUUID(),
      ...params,
    };
    this.trips[params.userId].push(trip);

    return trip;
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
