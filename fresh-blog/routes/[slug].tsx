import { Handlers, PageProps } from "$fresh/server.ts"
import { Head } from "$fresh/runtime.ts"
import { getPost, Post } from "../utils/posts.ts"
import { render, CSS } from "jsr:@deno/gfm"

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    const post = await getPost(ctx.params.slug)

    if (post === null) {
      return ctx.renderNotFound()
    }
    return ctx.render(post)
  },
}

export default function PostPage(props: PageProps<Post>) {
  const post = props.data;
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <main className="max-w-screen-md px-4 pt-16 mx-auto">
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:underline">← Back to Blog</a>
        </div>
        <h1 className="text-5xl font-bold">{post.title}</h1>
        <time class="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <div
          class="mt-8 markdown-body"
          dangerouslySetInnerHTML={{ __html: render(post.content) }}
        />
      </main>
    </>
  )
}
