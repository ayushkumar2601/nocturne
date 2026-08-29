import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

/**
 * Swagger / OpenAPI Documentation Plugin
 * Exposes JSON specs and interactive Swagger UI at /docs.
 */
export default fp(async (fastify) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "WETH Guardian ASP Runtime API",
        description:
          "Production REST API for WETH Guardian AI Security & Policy Engine (`@weth/agent`).",
        version: "2.0.0",
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || "3003"}`,
          description: "Local Development Server",
        },
      ],
      tags: [
        { name: "Guardian", description: "Core Intelligence & Analysis Endpoints" },
        { name: "Health", description: "Runtime Status & Health Checks" },
      ],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
  });
});
