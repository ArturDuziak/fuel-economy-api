import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

// Request
export const RequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export const RequestJsonSchema = zodToJsonSchema(RequestSchema);
export type Request = z.infer<typeof RequestSchema>;

// Response
export const ResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});
export const ResponseJsonSchema = zodToJsonSchema(ResponseSchema);
export type Response = z.infer<typeof ResponseSchema>;
