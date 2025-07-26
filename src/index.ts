import { initServer } from './server';
import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT) || 3000;

(async () => {
  const server = await initServer();

  server.listen({ port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server is running on ${address}`);
  });
})();
