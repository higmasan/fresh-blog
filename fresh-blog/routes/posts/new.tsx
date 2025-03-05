import { Handlers } from "$fresh/server.ts";
import { join } from "$std/path/join.ts";
import { DIRECTORY } from "../../utils/posts.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();
    const title = form.get("title")?.toString() || "";
    const content = form.get("content")?.toString() || "";
    const snippet = form.get("snippet")?.toString() || "";
    
    // タイムスタンプを YYYY-MM-DD-HH-mm-ss の形式で生成
    const now = new Date();
    const timestamp = now.toISOString()
      .replace('T', '-')
      .replace(/:/g, '-')
      .split('.')[0]; // 'YYYY-MM-DD-HH-mm-ss'
    const randomString = Math.random().toString(36).substring(2, 8);
    const slug = `${timestamp}-${randomString}`;

    // Markdownファイルの内容を作成
    const markdown = `---
title: ${title}
publishedAt: ${now.toISOString()}
snippet: ${snippet}
---

${content}`;

    // ファイルを保存
    const filePath = join(DIRECTORY, `${slug}.md`);
    await Deno.writeTextFile(filePath, markdown);

    // 作成した記事ページにリダイレクト
    return new Response("", {
      status: 303,
      headers: {
        Location: `/${slug}`,
      },
    });
  },
};

export default function NewPost() {
  return (
    <main className="max-w-screen-md px-4 pt-16 mx-auto">
      <h1 className="text-5xl font-bold">New Post</h1>
      <form className="mt-8" method="POST">
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="snippet">
            概要
          </label>
          <input
            type="text"
            id="snippet"
            name="snippet"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            本文
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            公開
          </button>
        </div>
      </form>
    </main>
  );
} 