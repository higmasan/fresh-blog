import { PostRepository } from "../db/repositories/post-repository.ts";
import type { Post as DBPost } from "../db/models/post.ts";

export interface Post {
  slug: string;
  title: string;
  publishedAt: Date;
  snippet: string;
  content: string;
}

function mapToPost(dbPost: DBPost): Post {
  return {
    slug: dbPost.slug,
    title: dbPost.title,
    publishedAt: dbPost.publishedAt,
    snippet: dbPost.snippet,
    content: dbPost.content,
  };
}

export async function getPosts(): Promise<Post[]> {
  const posts = await PostRepository.findAll();
  return posts.map(mapToPost);
}

export async function getPost(slug: string): Promise<Post | null> {
  const post = await PostRepository.findBySlug(slug);
  return post ? mapToPost(post) : null;
}

export async function createPost(post: Omit<Post, "slug">): Promise<string> {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace('T', '-')
    .replace(/:/g, '-')
    .split('.')[0];
  const randomString = Math.random().toString(36).substring(2, 8);
  const slug = `${timestamp}-${randomString}`;

  await PostRepository.create({
    ...post,
    slug,
    publishedAt: now,
  });

  return slug;
}
