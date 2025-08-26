import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verify } from 'jsonwebtoken';
import fp from 'fastify-plugin';
import { TokenPayload } from '../utils/auth';

const JWT_SECRET = process.env.JWT_SECRET as string;

declare module 'fastify' {
  interface FastifyInstance {
    verifyJwtAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    tokenInfo: TokenPayload;
  }
}

async function BearerAuth(server: FastifyInstance) {
  async function verifyJwtAuth(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request?.headers?.authorization;

    if (!authHeader) {
      return reply.code(401).send({
        message: 'Missing authorization header',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        message: 'Invalid authorization header format.',
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return reply.code(401).send({
        message: 'No token provided',
      });
    }

    try {
      const decoded = verify(token, JWT_SECRET) as TokenPayload;

      request.tokenInfo = decoded;
    } catch (error) {
      return reply.code(401).send({
        message: 'Invalid or expired token',
      });
    }
  }

  server.decorate('verifyJwtAuth', verifyJwtAuth);
}

export default fp(BearerAuth);
