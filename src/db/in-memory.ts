import { randomUUID } from 'node:crypto';
import fp from 'fastify-plugin';
import { Trip } from './types/trips';
import { AddTripParams, DatabaseInterface, PatchTripParams, PluginName, UpdateTripParams } from './interfaces';
import { FastifyInstance } from 'fastify';
import { NotFoundError } from './errors';

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

  async getTrip(userId: string, tripId: string): Promise<Trip> {
    const trip = this.trips[userId]?.find((trip) => trip.id === tripId);

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    return trip;
  }

  async updateTrip(params: UpdateTripParams): Promise<Trip> {
    const trip = this.trips[params.userId]?.find((trip) => trip.id === params.tripId);

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    const updatedTrip = {
      ...trip,
      ...params,
    };

    this.trips[params.userId][this.trips[params.userId].indexOf(trip)] = updatedTrip;

    return updatedTrip;
  }

  async patchTrip(params: PatchTripParams): Promise<Trip> {
    const trip = this.trips[params.userId]?.find((trip) => trip.id === params.tripId);

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    const updatedTrip = {
      ...trip,
      ...params,
    };

    this.trips[params.userId][this.trips[params.userId].indexOf(trip)] = updatedTrip;

    return updatedTrip;
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
