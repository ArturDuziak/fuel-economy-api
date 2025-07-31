import { Trip } from './types/trips';

export const PluginName = 'db';

export type AddTripParams = {
  userId: string;
} & Omit<Trip, 'id'>;

export interface DatabaseInterface {
  getTrips: (userId: string) => Promise<Trip[]>;
  addTrip: (params: AddTripParams) => Promise<Trip>;
  getTrip: (userId: string, tripId: string) => Promise<Trip>;
}
