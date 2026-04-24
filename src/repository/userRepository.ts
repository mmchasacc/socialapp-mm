import { password } from "bun";
import { db } from "../db/client";
import type { RegisterRequest } from "../types/http";
import type { UserRow } from "../types/db";

export async function insertOne(input: RegisterRequest) {
  const createdAt = new Date().toISOString();

  const [created] = await db<
    UserRow[]
  >`INSERT INTO users (username, visibility, profile_image, bio, display_name, email, phone, birthdate, password, created_at) VALUES (${input.username}, ${input.visibility}, ${input.profile_image}, ${input.bio}, ${input.display_name}, ${input.email}, ${input.phone}, ${input.birthdate}, ${input.password}, ${createdAt}) RETURNING *`;

  if (!created) throw new Error("Failed to create user!");

  return created;
}

export async function getByUsername(username: string) {
  const [user] = await db<UserRow[]>`
    SELECT * FROM users where username = ${username}
    `;

  return user || null;
}


export async function isFollowing(
  followingUsername: string,
  followedUsername: string,
): Promise<boolean> {
  const [relation] = await db`
  SELECT * FROM follower_relationships 
  WHERE following_user_id = (SELECT id from users WHERE username = ${followingUsername}) AND followed_user_id = (SELECT id from users WHERE username = ${followedUsername})
  `

  return !!relation
}


export async function addFollower(
  followingUsername: string,
  followedUsername: string,
) {
  const createdAt = new Date().toISOString()

  await db`
  INSERT INTO follower_relationships (following_user_id, followed_user_id, created_at) VALUES ((SELECT id from users WHERE username = ${followingUsername}), (SELECT id from users WHERE username = ${followedUsername}), ${createdAt})
  `
}

export async function removeFollower(
  followingUsername: string,
  followedUsername: string,
) {
  await db`
  DELETE FROM follower_relationships WHERE following_user_id = (SELECT id from users WHERE username = ${followingUsername}) AND followed_user_id = (SELECT id from users WHERE username = ${followedUsername})
  `
}


/* 
export async function follow(followerId: number, followedid: number) {

  const createdAt = new Date().toISOString()

  await db`INSERT INTO follower_relationships (following_user_id, followed_user_id, created_at) VALUES (${followerId}, ${followedid}, ${createdAt} ON CONFLICT DO NOTHING)`
}

export async function unfollow(followerId: number, followedId: number) {
  await db`
  DELETE FROM follower_relationships WHERE following_user_id = ${followerId} AND followed_user_id = ${followedId}`
} */