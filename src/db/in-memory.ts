import { randomUUID, randomBytes, scryptSync } from 'node:crypto';
import fp from 'fastify-plugin';
import { Trip } from './types/trips';
import { AddTripParams, CreateUserParams, DatabaseInterface, PatchTripParams, PluginName, UpdateTripParams } from './interfaces';
import { FastifyInstance } from 'fastify';
import { ConflictError, NotFoundError } from './errors';
import { User } from './types/user';

function hashPassword(plainTextPassword: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(plainTextPassword, salt, 64).toString('hex');

  return `${salt}:${derivedKey}`;
}

export class InMemoryDatabase implements DatabaseInterface {
  private trips: Record<string, Trip[]> = {};
  private users: Record<string, User> = {};
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

  async createUser(params: CreateUserParams): Promise<User> {
    if (this.users[params.email]) {
      throw new ConflictError('User already exists');
    }

    const user = {
      id: randomUUID(),
      email: params.email,
      passwordHash: hashPassword(params.password),
    };

    this.users[user.id] = user;

    return user;
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
