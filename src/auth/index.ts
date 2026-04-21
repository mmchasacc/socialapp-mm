import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin"
import type { FastifyInstance, FastifyPluginOptions } from "fastify";

const secretKey = process.env.JWT_SECRET_KEY;

async function auth(
  httpServer: FastifyInstance,
  options: FastifyPluginOptions,
) {
  if (!secretKey) throw new Error("Provide JWT_SECRET_KEY env!");

  await httpServer.register(fastifyJwt, {
    secret: secretKey,
  });
}

export default fp(auth);
