import { Trip } from './types/trips';
import { User } from './types/user';

export const PluginName = 'db';

export type AddTripParams = {
  userId: string;
} & Omit<Trip, 'id'>;

export type UpdateTripParams = {
  userId: string;
  tripId: string;
} & Omit<Trip, 'id'>;

export type PatchTripParams = {
  userId: string;
  tripId: string;
} & Partial<Omit<Trip, 'id'>>;

export type CreateUserParams = {
  email: string;
  password: string;
};

export interface DatabaseInterface {
  getTrips: (userId: string) => Promise<Trip[]>;
  addTrip: (params: AddTripParams) => Promise<Trip>;
  getTrip: (userId: string, tripId: string) => Promise<Trip>;
  updateTrip: (params: UpdateTripParams) => Promise<Trip>;
  patchTrip: (params: PatchTripParams) => Promise<Trip>;

  createUser: (params: CreateUserParams) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User>;
}
