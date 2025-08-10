import { FastifyInstance } from 'fastify';
import { Register } from '../../schemas/auth';
import { NotFoundError } from '../../db/errors';

const routeBaseSchema = {
  tags: ['Auth'],
};

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
}

export default async function (fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: '/' });
}
