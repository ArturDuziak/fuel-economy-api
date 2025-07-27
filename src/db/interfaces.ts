import { Trip } from './types/trips';

export const PluginName = 'db';
export interface DatabaseInterface {
  getTrips: (userId: string) => Promise<Trip[]>;
}
