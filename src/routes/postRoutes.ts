import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as postsController from "../controllers/postsController";
import authenticate from "../auth/authenticate";

async function postRoutes(
  httpServer: FastifyInstance,
  options: FastifyPluginOptions,
) {
  httpServer.route({
    method: "POST",
    url: "/create",
    handler: postsController.createPost,
    preHandler: [authenticate],
  });
}

/*

1. Routing – Kollar upp vilken URL anropet har gjorts till, och kollar om vi har en sådan route
i vår server. 

2. Deserialisering

3. Schema validation?

4. preHandlers:

- authenticate
- upload.single

5. controller/handler

*/
