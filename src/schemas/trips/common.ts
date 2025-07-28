import { z } from 'zod';

export const FuelConsumptionSchema = z
  .number()
  .min(0, 'Fuel consumption must be at least 0.0')
  .max(100, 'Fuel consumption must be at most 100.0');

const CoordinatesSchema = z.object({
  lat: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  lng: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
});

export const TripSchema = z.object({
  id: z.string().uuid(),
  startDate: z.string(),
  endDate: z.string(),
  travelTime: z.number(),
  distance: z.number(),
  avgSpeed: z.number(),
  fuelConsumption: FuelConsumptionSchema,
  startCoordinates: CoordinatesSchema,
  endCoordinates: CoordinatesSchema,
});
