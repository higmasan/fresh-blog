import { join } from "$std/path/join.ts";
import { extractYaml } from "@std/front-matter";
import { exists } from "$std/fs/exists.ts";

const DIRECTORY = "./posts";

export interface Post {
  slug: string;
  title: string;
  publishedAt: Date;
  snippet: string;
  content: string;
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
