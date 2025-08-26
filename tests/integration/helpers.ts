import { randomUUID } from 'node:crypto';
import { inject } from 'vitest';
import request, { Test } from 'supertest';

const serverUrl = inject('serverUrl');

export const createRandomUser = () => {
  return {
    id: randomUUID(),
    email: `test-${randomUUID()}@test.com`,
    password: 'password',
  };
};

type User = {
  email: string;
  password: string;
};

export const registerUser = async (user: User): Promise<{ id: string }> => {
  const response = await fetch(`${serverUrl}/v1/register`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(user),
  });

  return response.json();
};

export const loginUser = async (user: User): Promise<{ token: string; refreshToken: string }> => {
  const response = await fetch(`${serverUrl}/v1/login`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(user),
  });

  return response.json();
};

export interface AuthenticatedAgent {
  get: (url: string) => Test;
  post: (url: string) => Test;
  put: (url: string) => Test;
  patch: (url: string) => Test;
  delete: (url: string) => Test;
}

/**
 * Creates an authenticated supertest agent with JWT token
 */
export const createAuthenticatedAgent = async (user: User): Promise<AuthenticatedAgent> => {
  const { token } = await loginUser(user);
  const authHeader = `Bearer ${token}`;
  const agent = request(serverUrl);

  return {
    get: (url: string) => agent.get(url).set('Authorization', authHeader),
    post: (url: string) => agent.post(url).set('Authorization', authHeader),
    put: (url: string) => agent.put(url).set('Authorization', authHeader),
    patch: (url: string) => agent.patch(url).set('Authorization', authHeader),
    delete: (url: string) => agent.delete(url).set('Authorization', authHeader),
  };
};

/**
 * Creates a user, registers them, and returns an authenticated supertest agent
 */
export const createAuthenticatedTestUser = async () => {
  const user = createRandomUser();
  const { id: userId } = await registerUser(user);
  const authenticatedAgent = await createAuthenticatedAgent(user);

  return { user, userId, authenticatedAgent };
};
