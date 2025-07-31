import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { TripSchema } from './common';

// Response
export const ResponseSchema = TripSchema;
export const ResponseJsonSchema = zodToJsonSchema(ResponseSchema);
export type Response = z.infer<typeof ResponseSchema>;
