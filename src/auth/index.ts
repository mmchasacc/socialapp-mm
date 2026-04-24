import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin"
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { TokenPayload } from "../types/auth";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: TokenPayload

  }
}

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
