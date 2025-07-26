import { z } from 'zod';

export const TripSchema = z.object({
  id: z.string().uuid(),
  startDate: z.string(),
  endDate: z.string(),
  travelTime: z.number(),
  distance: z.number(),
  avgSpeed: z.number(),
  fuelConsumption: z.string(),
  startCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  endCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export const ResponseSchema = z.array(TripSchema);

export const ResponseJsonSchema = z.toJSONSchema(ResponseSchema);

export type Response = z.infer<typeof ResponseSchema>;
