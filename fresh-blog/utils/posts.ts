import { join } from "$std/path/join.ts";
import { extractYaml } from "@std/front-matter";
import { exists } from "$std/fs/exists.ts";

export const DIRECTORY = "./posts";

export interface Post {
  slug: string;
  title: string;
  publishedAt: Date;
  snippet: string;
  content: string;
}

export async function getPosts(): Promise<Post[]> {
  const files = Deno.readDir(DIRECTORY);
  const promises = [];
  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    promises.push(getPost(slug));
  }
  const results = await Promise.all(promises);
  const posts = results.filter((post): post is Post => post !== null); 
  posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return posts;
}

export async function getPost(slug: string): Promise<Post | null> {
  const filePath = join(DIRECTORY, `${slug}.md`);
  if (!(await exists(filePath))) {
    return null
  }

  const text = await Deno.readTextFile(filePath);
  const { attrs, body } = extractYaml<Post>(text);
  return {
    slug,
    title: attrs.title,
    publishedAt: new Date(attrs.publishedAt),
    content: body,
    snippet: attrs.snippet,
  };
}
