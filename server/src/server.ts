import { readEnv } from "./config/env.js";
import { buildServer } from "./app.js";

async function start(): Promise<void> {
  const env = readEnv();
  const app = await buildServer(env);

  try {
    await app.listen({
      host: env.host,
      port: env.port
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
