import type { FastifyReply, FastifyRequest } from "fastify";
import type { LoginRequest, RegisterRequest } from "../types/http";
import repository from "../repository";
import type { TokenPayload } from "../types/auth";

/*
Vad är ansvarsområdeet för controllers?

Svar: Controllers är en del av vår HTTP-del, och har som ansvar att validera och plocka ut
indata från HTTP-requesten. Samt även ansvar att returnera en HTTP-respons.
*/
export async function register(
  request: FastifyRequest<{ Body: RegisterRequest }>,
  reply: FastifyReply,
) {
  await repository.users.insertOne(request.body);
}

export async function login(
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply,
) {
  const foundUser = await repository.users.getByUsername(request.body.username);

  if (!foundUser) return reply.status(404).send({ message: "User not found!" });

  if (foundUser.password !== request.body.password)
    return reply.status(401).send({ message: "Incorrect password!" });

  const tokenPayload: TokenPayload = {
    username: foundUser.username,
    email: foundUser.email,
  };

  const token = await reply.jwtSign(tokenPayload, {
    expiresIn: "100y",
  });

  return reply.status(200).send({
    token,
    user: foundUser,
  });
}
