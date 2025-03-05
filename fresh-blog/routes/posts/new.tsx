import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { CSS } from "jsr:@deno/gfm";
import { render } from "jsr:@deno/gfm";
import { createPost } from "../../utils/posts.ts";

interface PreviewData {
  title: string;
  content: string;
  rawContent: string;
  snippet: string;
  date: string;
}

interface FormData {
  title: string;
  snippet: string;
  content: string;
}

// プレビューデータを生成する関数
function generatePreviewData(formData: FormData): Promise<PreviewData> {
  return new Promise((resolve) => {
    const title = formData.title;
    const snippet = formData.snippet;
    const content = formData.content;
    const html = render(content);
    const now = new Date();
    const date = now.toISOString();

    resolve({
      title,
      content: html,
      rawContent: content,
      snippet,
      date,
    })
  })
}

export const handler: Handlers<{ preview: PreviewData | null; form: FormData | null }> = {
  async POST(req, ctx) {
    const url = new URL(req.url);
    const isPreview = url.searchParams.get("preview") === "true";
    const isCreate = url.searchParams.get("create") === "true";

    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const snippet = formData.get("snippet")?.toString() || "";
    const form: FormData = { title, snippet, content };

    if (isPreview) {
      const previewData = await generatePreviewData(form);
      return ctx.render({ preview: previewData, form: null });
    }

    if (isCreate) {
      const slug = await createPost({
        title,
        content,
        snippet,
        publishedAt: new Date(),
      });

      return new Response("", {
        status: 303,
        headers: {
          Location: `/${slug}`,
        },
      });
    }

    return ctx.render({
      preview: null,
      form: form
    });
  },

  GET(_req, ctx) {
    return ctx.render({ preview: null, form: null });
  },
};

export default function NewPost({ data }: PageProps<{ preview: PreviewData | null; form: FormData | null }>) {
  const { preview, form } = data;

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <main className="max-w-screen-md px-4 pt-16 mx-auto">
        <h1 className="text-5xl font-bold">新規記事作成</h1>
        
        {!preview ? (
          <form className="mt-8" method="POST">

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                タイトル
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form?.title || ""}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="snippet">
                記事の簡単な説明
              </label>
              <input
                type="text"
                id="snippet"
                name="snippet"
                value={form?.snippet || ""}
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
                value={form?.content || ""}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="flex space-x-4 mb-4">
              <button
                type="submit"
                formAction="/posts/new"
                className="py-2 px-4 mt-4 rounded bg-blue-500 text-white"
              >
                編集
              </button>
              <button
                type="submit"
                formAction="/posts/new?preview=true"
                className="py-2 px-4 mt-4 rounded bg-gray-200 text-gray-700"
              >
                プレビュー
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                formAction="/posts/new?create=true"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                公開
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8">
            <form method="POST">
              
              <input type="hidden" name="title" value={preview.title} />
              <input type="hidden" name="snippet" value={preview.snippet} />
              <input type="hidden" name="content" value={preview.rawContent} />
              
              <div className="border rounded-lg p-6">
                <h1 className="text-4xl font-bold">{preview.title || "Untitled"}</h1>
                <time className="text-gray-500 block mt-2">{preview.date}</time>
                <div
                  className="mt-8 markdown-body"
                  dangerouslySetInnerHTML={{ __html: preview.content }}
                />
              </div>
              
              <div className="flex space-x-4 mb-4">
                <button
                  type="submit"
                  formAction="/posts/new"
                  className="py-2 px-4 mt-4 rounded bg-gray-200 text-gray-700"
                >
                  編集
                </button>
                <button
                  type="submit"
                  formAction="/posts/new?preview=true"
                  className="py-2 px-4 mt-4 rounded bg-blue-500 text-white"
                >
                  プレビュー
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  formAction="/posts/new?create=true"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  公開
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
} 