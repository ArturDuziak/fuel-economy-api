import { Trip } from './types/trips';

export interface DatabaseInterface {
  getTrips: (userId: string) => Promise<Trip[]>;
}
