import { z } from 'zod';

export const FuelConsumptionSchema = z.string().refine(
  (val) => {
    const num = parseFloat(val);
    return num >= 0 && num < 100;
  },
  {
    message: 'Fuel consumption must be between 0 and 100',
  },
);

export const TripSchema = z.object({
  id: z.string().uuid(),
  startDate: z.string(),
  endDate: z.string(),
  travelTime: z.number(),
  distance: z.number(),
  avgSpeed: z.number(),
  fuelConsumption: FuelConsumptionSchema,
  startCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  endCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});
