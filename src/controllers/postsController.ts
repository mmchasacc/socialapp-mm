import type { FastifyReply, FastifyRequest } from "fastify";
import repository from "../repository";
import type { CreatePostRequest } from "../types/http";
import type { TokenPayload } from "../types/auth";
import uploadImageToS3 from "../adapters/s3";

export async function createPost(
  request: FastifyRequest<{ Body: CreatePostRequest }>,
  reply: FastifyReply,
) {
  const tokenPayload = request.user as TokenPayload;

  const file = await request.file();

  if (!file) {
    return reply.status(400).send( { message: "Image is required" } )
  }

  const buffer = await file.toBuffer()

  const imageUrl = await uploadImageToS3(buffer, file.filename, file.mimetype)

  if (!imageUrl) {
    return reply.status(500).send({
      message: "Failed to upload image to S3"
    })
  }

  const captionField = file.fields.caption as any

  const requestBody: CreatePostRequest = {
    caption: captionField ? captionField.value : undefined,
    image: imageUrl as any,
  }

  const createdPost = await repository.posts.insertOne(
    requestBody,
    tokenPayload.username,
  );

  return reply.status(201).send(createdPost);
}

export async function getFeed(request: FastifyRequest, reply: FastifyReply) {
  const username = request.user.username

  const feed = await repository.posts.getUserFeed(username)

    return reply.status(200).send(feed)
}

/*

Att göra:

Slutför kopplingen mellan createPost och Amazon S3.

Så att man kan anropa POST /create och ladda upp en bild och spara länken i databasen. 

*/
