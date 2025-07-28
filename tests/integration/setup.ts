import type { TestProject } from 'vitest/node';
import { initServer } from '../../src/server';

export default async function setupServer(project: TestProject) {
  const server = await initServer();

  await server.listen({ port: 3000 });

  return async () => {
    await server.close();
  };
}
