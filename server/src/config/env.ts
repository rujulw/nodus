export interface AppEnv {
  host: string;
  port: number;
  nodeEnv: string;
  apiPrefix: string;
}

const DEFAULT_HOST = "0.0.0.0";
const DEFAULT_PORT = 4000;
const DEFAULT_API_PREFIX = "/api/v1";

export function readEnv(env: NodeJS.ProcessEnv = process.env): AppEnv {
  const port = Number(env.PORT ?? DEFAULT_PORT);

  return {
    host: env.HOST ?? DEFAULT_HOST,
    port: Number.isFinite(port) ? port : DEFAULT_PORT,
    nodeEnv: env.NODE_ENV ?? "development",
    apiPrefix: env.API_PREFIX ?? DEFAULT_API_PREFIX
  };
}
