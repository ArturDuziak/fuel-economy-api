import { FastifyInstance } from 'fastify';
import { Register, Login } from '../../schemas/auth';
import { UnauthorizedError } from '../../db/errors';
import { isPasswordValid } from '../../utils/crypto';
import { generateTokens } from '../../utils/auth';
import zodToJsonSchema from 'zod-to-json-schema';
import { z } from 'zod';

const routeBaseSchema = {
  tags: ['Auth'],
};

const UnauthorizedErrorSchema = z.object({
  message: z.string(),
});

async function authRoutes(server: FastifyInstance) {
  server.post<{ Body: Register.Request }>(
    '/register',
    {
      schema: {
        ...routeBaseSchema,
        description: 'Register a new user',
        body: Register.RequestJsonSchema,
        response: { 201: Register.ResponseJsonSchema },
      },
    },
    async (req, res) => {
      const { email, password } = req.body;

      const user = await server.db.createUser({ email, password });

      return res.status(201).send({ userId: user.id });
    },
  );

  server.post<{ Body: Login.Request }>(
    '/login',
    {
      schema: {
        ...routeBaseSchema,
        description: 'Login a user',
        body: Login.RequestJsonSchema,
        response: {
          200: Login.ResponseJsonSchema,
          401: zodToJsonSchema(UnauthorizedErrorSchema),
        },
      },
    },
    async (req, res) => {
      const { email, password } = req.body;

      try {
        const user = await server.db.getUserByEmail(email);

        if (!user || !isPasswordValid(password, user.passwordHash)) {
          throw new UnauthorizedError('Invalid credentials');
        }

        const tokens = generateTokens({
          userId: user.id,
          email: user.email,
        });

        return res.send({
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      } catch {
        return res.status(401).send({ message: 'Invalid credentials' });
      }
    },
  );
}

export default async function (fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: '/' });
}
