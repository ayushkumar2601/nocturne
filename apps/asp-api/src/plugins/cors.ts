import fp from "fastify-plugin";
import cors from "@fastify/cors";

/**
 * CORS Plugin
 * Configured to allow requests from WETH Guardian Web UI, OKX Runtime, and local dev.
 */
export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: process.env.WEB_URL || true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });
});
