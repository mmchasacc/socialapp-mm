import fastify from "fastify";
import banner from "./banner";
import userRoutes from "./routes/userRoutes";
import auth from "./auth/index";
import fastifyMultipart from "@fastify/multipart";
import postRoutes from "./routes/postRoutes";

const httpServer = fastify({});

const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";

httpServer.setErrorHandler((err: any, req, rep) => {
  if (err?.statusCode === 400) {
    return rep.status(400).send({ message: err.message });
  }

  console.log(err);

  return rep.status(500).send({
    message: "Unknown error occurred",
  });
});

async function start() {
  await httpServer.register(userRoutes);

  
  await httpServer.register(auth);
  
  await httpServer.register(fastifyMultipart, {
    limits: {
      fileSize: 15_000_000,
      files: 1,
    },
  });
  
  await httpServer.register(postRoutes)
  
  await httpServer.listen({ host, port });

  banner("TEST-SERVICE", "ENV: DEVELOPMENT", `HOST: ${host}:${port}`);
}

start();
