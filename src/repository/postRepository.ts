import { db } from "../db/client";
import type { FeedRow, PostRow } from "../types/db";
import type { CreatePostRequest } from "../types/http";

export async function insertOne(
  input: CreatePostRequest,
  username: string,
): Promise<PostRow> {
  const createdAt = new Date().toISOString();
  const status = "active";

  const [created] = await db<
    PostRow[]
  >`INSERT INTO posts (status, user_id, image, caption, created_at) VALUES (${status}, (SELECT id FROM users WHERE username = ${username} LIMIT 1), ${input.image}, ${input.caption}, ${createdAt}) RETURNING *`;

  if (!created) throw new Error("Failed to create user!");

  return created;
}

export async function getUserFeed(username: string): Promise<FeedRow[]> {

  const feed = await db`
  WITH my_user_id AS (SELECT id FROM users WHERE username = ${username})

  SELECT p.id, p.image, p.caption, p.created_at, u.username, u.profile_image, u.display_name AS user_display_name
  FROM posts as p
  LEFT JOIN users AS u ON p.user_id = u.id
  WHERE p.status = 'active'
    AND (p.user_id = (SELECT id FROM my_user_id) OR p.user_id IN (SELECT followed_user_id FROM follower_relationships WHERE following_user_id = (SELECT id FROM my_user_id))
    )
    ORDER BY p.created_at DESC
    LIMIT 25
  `

  return feed
}