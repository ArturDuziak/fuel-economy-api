import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { TripSchema } from './common';

// Request
export const RequestSchema = TripSchema.partial();
export const RequestJsonSchema = zodToJsonSchema(RequestSchema);
export type Request = z.infer<typeof RequestSchema>;

// Response
export const ResponseSchema = TripSchema;
export const ResponseJsonSchema = zodToJsonSchema(ResponseSchema);
export type Response = z.infer<typeof ResponseSchema>;
