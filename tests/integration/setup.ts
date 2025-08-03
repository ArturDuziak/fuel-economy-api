import type { TestProject } from 'vitest/node';
import { initServer } from '../../src/server';

export default async function setupServer(project: TestProject) {
  const server = await initServer();

  const port = Math.floor(Math.random() * 10000) + 3000;

  await server.listen({ port });

  project.provide('serverUrl', `http://localhost:${port}`);

  return async () => {
    await server.close();
  };
}

declare module 'vitest' {
  export interface ProvidedContext {
    serverUrl: string;
  }
}
