import { FastifyInstance } from "fastify";

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/health",
    {
      schema: {
        description: "Health check endpoint returning ASP service readiness without blockchain dependencies.",
        tags: ["Health"],
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              service: { type: "string" },
              version: { type: "string" },
              timestamp: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      return {
        status: "healthy",
        service: "weth-guardian-asp",
        version: "2.0.0",
        timestamp: new Date().toISOString(),
      };
    }
  );
}
